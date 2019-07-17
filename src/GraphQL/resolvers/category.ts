import { combineResolvers } from 'graphql-resolvers'
import { UserInputError } from 'apollo-server'

import { isAdmin } from './middleware/authorization'
import { deleteImages } from '../utils/cloudinary'
import logger from '../../common/logger'

export default {
	Query: {
		categories: async (_: any, __: any, { models }: any) => {
			return await models.Category.findAll({
				order: [['createdAt', 'DESC']]
			})
		},
		category: async (_: any, { id }: any, { models }: any) => {
			return await models.Category.findByPk(id)
		}
	},

	Mutation: {
		addCategory: combineResolvers(
			isAdmin,
			async (_: any, { data: { name } }: any, { models }: any) => {
				return await models.Category.create({ name })
			}
		),

		deleteCategory: combineResolvers(isAdmin, async (_: any, { id }: any, { models }: any) => {
			if (!id) throw new UserInputError('Invalid category id.')
			const category = await models.Category.findByPk(id)
			if (!category) throw new UserInputError('No category found with the given id.')
			/* Delete all product images under this category */
			await deleteCategoryAsset(category, models)
			return await models.Category.destroy({ where: { id } }) /* All product also will be deleted */
		}),

		updateCategory: combineResolvers(
			isAdmin,
			async (_: any, { id, data: { name } }: any, { models }: any) => {
				await models.Category.update({ name }, { where: { id } })
				return await models.Category.findByPk(id)
			}
		)
	},

	Category: {
		products: async (category: any, __: any, { models }: any) => {
			return await models.Product.findAll({
				order: [['createdAt', 'DESC']],
				where: {
					categoryId: category.id
				}
			})
		}
	}
}

/* Regular Helper Function */

const deleteCategoryAsset = async (category: any, models: any) => {
	const { id, name } = category
	const products = await models.Product.findAll({ where: { categoryId: id } })
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
