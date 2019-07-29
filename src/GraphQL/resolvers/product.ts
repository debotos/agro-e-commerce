import Sequelize from 'sequelize'
import { combineResolvers } from 'graphql-resolvers'
import { UserInputError } from 'apollo-server'
// @ts-ignore: '@types/promises-all officially not available'
import promisesAll from 'promises-all'

import { isAuthenticated, isProductOwner } from './middleware/authorization'
import { toCursorHash, fromCursorHash } from '../utils/cursor'
import { uploadOneImage, deleteImages } from '../utils/cloudinary'
import logger from '../../common/logger'

export default {
	Query: {
		products: async (
			_: any,
			{ limit = 10, offset = 0, cursor, searchText, categoryId, userId, division, region }: any,
			{ models }: any
		) => {
			/* 
				The first page only retrieves the most recent products in the list, 
				so you can use the creation date of the last product as a cursor for the next page of products.
			*/

			/* Here the ternary operator for the cursor makes sure the cursor isn’t needed for the first page request */
			const options: any = {}

			if (cursor) {
				options.where = {
					createdAt: {
						[Sequelize.Op.lt]: fromCursorHash(cursor)
					}
				}
			}

			if (categoryId) {
				if (options.where) {
					options.where = { ...options.where, categoryId }
				} else {
					options.where = { categoryId }
				}
			}

			if (userId) {
				if (options.where) {
					options.where = { ...options.where, userId }
				} else {
					options.where = { userId }
				}
			}

			if (searchText) {
				const Op = Sequelize.Op
				const query = {
					[Op.or]: [
						{
							name: { [Op.iLike]: `%${searchText}%` }
						},
						{
							description: { [Op.iLike]: `% ${searchText} %` }
						}
					]
				}
				if (options.where) {
					options.where = { ...options.where, ...query }
				} else {
					options.where = { ...query }
				}
			}

			/* Have to test (start) */
			if (region && !division) {
				const Op = Sequelize.Op
				options.include = [
					{
						model: models.User,
						where: { region: { [Op.iLike]: `%${region}%` } },
						attributes: []
					}
				]
			}
			if (!region && division) {
				const Op = Sequelize.Op
				options.include = [
					{
						model: models.User,
						where: { division: { [Op.iLike]: `%${division}%` } },
						attributes: []
					}
				]
			}
			// Same as upper
			if (region && division) {
				const Op = Sequelize.Op
				options.include = [
					{
						model: models.User,
						where: { division: { [Op.iLike]: `%${division}%` } },
						attributes: []
					}
				]
			}
			/* Have to test (end) */

			const products = await models.Product.findAll({
				order: [
					['createdAt', 'DESC']
				] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
				offset,
				limit: limit + 1 /* Added 1 to calculate hasNextPage: Boolean! value */,
				...options,
				raw: true
			})

			const hasNextPage = products.length > limit
			const edges = hasNextPage ? products.slice(0, -1) : products

			return {
				edges,
				pageInfo: {
					/* The client application doesn’t need the details for the cursor of the last message,
						as it have hasNextPage & endCursor now.
						if hasNextPage === true then make another request using endCursor.
					*/
					hasNextPage,
					/* The GraphQL client receives a hashed endCursor field */
					endCursor: hasNextPage
						? toCursorHash(
								edges[edges.length - 1].createdAt.toISOString()
						  ) /* toISOString() is a moment.js function */
						: 'Not available. You are end of the page!'
				}
			}
		},
		product: async (_: any, { id }: any, { models }: any) => {
			return await models.Product.findByPk(id, { raw: true })
		}
	},

	Mutation: {
		addProduct: combineResolvers(
			isAuthenticated,
			async (_: any, { data }: any, { me, models }: any) => {
				const category = await models.Category.findByPk(data.categoryId, { raw: true })
				if (!category) throw new UserInputError('Invalid categoryId.')
				return await models.Product.create({
					...data,
					userId: me.id
				})
			}
		),

		deleteProduct: combineResolvers(
			isAuthenticated,
			isProductOwner,
			async (_: any, { id }: any, { models }: any) => {
				const product = await models.Product.findByPk(id, { raw: true })
				if (product.images) {
					const public_ids = product.images.map((x: any) => x.public_id)
					await deleteImages(public_ids)
				}
				return {
					success: await models.Product.destroy({ where: { id } }),
					id
				}
			}
		),

		addProductImage: combineResolvers(
			isAuthenticated,
			isProductOwner,
			async (_: any, { id, image }: any, { me, models }: any) => {
				console.log('[addProductImage]Server got the image to upload => ', image)
				const { createReadStream }: any = await image
				const stream = createReadStream()
				const path = `${me.role}/${me.user_name}/products/${id}`
				const response = await uploadOneImage(stream, path)
				if (!response) {
					throw new Error('Failed to upload product image.')
				}
				const product = await models.Product.findByPk(id, { raw: true })
				const images = product.images

				let newImages
				if (images) {
					newImages = [response, ...images]
				} else {
					newImages = [response]
				}

				await models.Product.update({ images: newImages }, { where: { id } })
				return response
			}
		),

		addProductImages: combineResolvers(
			isAuthenticated,
			isProductOwner,
			async (_: any, { id, images }: any, { me, models }: any) => {
				console.log('[addProductImages]Server got the images => ', images)
				const { resolve, reject } = await promisesAll.all(
					images.map(async (image: any) => {
						console.log('[addProductImages]Single image => ', image)
						const { createReadStream }: any = await image
						const stream = createReadStream()
						const path = `${me.role}/${me.user_name}/products/${id}`
						return await uploadOneImage(stream, path)
					})
				)

				if (reject.length) {
					reject.forEach(({ name, message }: any) => {
						logger.error(`${name}:${message}`)
					})
				}

				if (!resolve) {
					throw new Error('Failed to upload product images.')
				}
				await models.Product.update({ images: resolve }, { where: { id } })
				return resolve /* return uploaded images array */
			}
		),

		deleteProductImage: combineResolvers(
			isAuthenticated,
			isProductOwner,
			async (_: any, { id, image_public_id }: any, { models }: any) => {
				const product = await models.Product.findByPk(id, { raw: true })
				let images = product.images
				// Check images exist
				if (!images) throw new UserInputError("Invalid image_public_id. It doesn't exist.")
				// check image_public_id exist
				const image = images.find((x: any) => x.public_id === image_public_id)
				console.log(image)
				if (!image) throw new UserInputError("Invalid image_public_id. It doesn't exist.")
				//  Delete image file from cloudinary
				const public_ids = [image_public_id]
				await deleteImages(public_ids)
				// Remove entry from DB and update
				images = images.filter((x: any) => x.public_id !== image_public_id)
				/* 
					You can get the info about update action via,
					const [rowsUpdate, [updatedBook]] = await models.Product.update(
						{ images },
						{ returning: true, where: { id } }
					)
					console.log(rowsUpdate, updatedBook)
				*/
				const [updateCount] = await models.Product.update({ images }, { where: { id } })
				return updateCount /* 1 will be true */
			}
		),

		updateProduct: combineResolvers(
			isAuthenticated,
			isProductOwner,
			async (_: any, { id, data }: any, { models }: any) => {
				const [rowsUpdate, [updatedProduct]] = await models.Product.update(
					{ ...data },
					{ returning: true, where: { id } }
				)

				logger.info(`${rowsUpdate} product updated(ID: ${id})`)

				return updatedProduct
			}
		)
	},

	Product: {
		user: async (product: any, __: any, { loaders }: any) => {
			return await loaders.user.load(product.userId)
		},

		category: async (product: any, __: any, { loaders }: any) => {
			return await loaders.category.load(product.categoryId)
		}
	}
}
