import { combineResolvers } from 'graphql-resolvers'
import { UserInputError } from 'apollo-server'

import { isAdmin } from './middleware/authorization'
import logger from '../../common/logger'
import { uploadOneImage, deleteImages } from '../utils/cloudinary'
import { getCloudinaryPublicId } from '../utils/helperFunctions'

export default {
	Query: {
		categories: async (_: any, __: any, { models }: any) => {
			return await models.Category.findAll({
				order: [['createdAt', 'DESC']],
				raw: true
			})
		},
		category: async (_: any, { id }: any, { models }: any) => {
			return await models.Category.findByPk(id, { raw: true })
		}
	},

	Mutation: {
		addCategory: combineResolvers(
			isAdmin,
			async (_: any, { data: { name, image } }: any, { models }: any) => {
				if (!name || !image) throw new UserInputError('Provide both name & image.')
				if (name.length > 50 || name.length < 3) {
					throw new UserInputError('Category length min: 3 and max: 50')
				}
				const { createReadStream }: any = await image
				const stream = createReadStream()
				const path = `Assets/Category`
				const response: any = await uploadOneImage(stream, path)
				if (!response) {
					throw new Error('Failed to upload profile image.')
				}
				return await models.Category.create({ name, image: response.secure_url })
			}
		),

		deleteCategory: combineResolvers(isAdmin, async (_: any, { id }: any, { models }: any) => {
			if (!id) throw new UserInputError('Invalid category id.')
			const category = await models.Category.findByPk(id, { raw: true })
			if (!category) throw new UserInputError('No category found with the given id.')
			/* Delete all product images under this category */
			await deleteCategoryAsset(category, models)
			return {
				success: await models.Category.destroy({
					where: { id }
				}) /* All product also will be deleted */,
				id
			}
		}),

		updateCategory: combineResolvers(
			isAdmin,
			async (_: any, { id, data: { name, image } }: any, { models }: any) => {
				if (!name && !image) throw new UserInputError('Provide name or image to update.')
				const category = await models.Category.findByPk(id, { raw: true })
				if (!category) throw new UserInputError('No category found with the given id.')

				let updatedImageUrl
				if (image) {
					/* Upload the new one */
					const { createReadStream }: any = await image
					const stream = createReadStream()
					const path = `Assets/Category`
					const response: any = await uploadOneImage(stream, path)
					if (!response) {
						throw new Error('Failed to upload profile image.')
					}
					updatedImageUrl = response.secure_url
				}

				const updates: any = {}
				if (updatedImageUrl) {
					updates.image = updatedImageUrl
				}
				if (name) {
					updates.name = name
				}

				await models.Category.update(updates, { where: { id } })
				if (image) {
					/* At the end, Delete the Previous image */
					await deleteCategoryImage(category)
				}
				return await models.Category.findByPk(id, { raw: true })
			}
		)
	},

	Category: {
		products: async (category: any, __: any, { models }: any) => {
			return await models.Product.findAll({
				order: [['createdAt', 'DESC']],
				where: {
					categoryId: category.id
				},
				raw: true
			})
		}
	}
}

/* Regular Helper Function */

const deleteCategoryAsset = async (category: any, models: any) => {
	const { id, name, image } = category
	/* Delete category image */
	if (image) {
		await deleteImages([getCloudinaryPublicId(image)])
	}
	/* Delete product iamges */
	const products = await models.Product.findAll({ where: { categoryId: id }, raw: true })
	if (products) {
		const public_ids = products
			.map((x: any) => {
				if (x.images) {
					return x.images.map((image: any) => image.public_id)
				} else {
					return []
				}
			})
			.flat()
		if (public_ids.length > 0) {
			await deleteImages(public_ids)
			logger.info(`Total ${public_ids.length} images deleted under category '${name}' id ${id}`)
		}
		logger.info(`Total ${products.length} products deleted under category '${name}' id ${id}`)
	}
}

const deleteCategoryImage = async (category: any) => {
	const { image } = category
	if (image) {
		await deleteImages([getCloudinaryPublicId(image)])
	}
}
