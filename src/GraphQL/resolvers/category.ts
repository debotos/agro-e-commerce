import { combineResolvers } from 'graphql-resolvers'

import { isAuthenticated, isAdmin } from './middleware/authorization'

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
			isAuthenticated,
			isAdmin,
			async (_: any, { data: { name } }: any, { models }: any) => {
				return await models.Category.create({ name })
			}
		),

		deleteCategory: combineResolvers(
			isAuthenticated,
			isAdmin,
			async (_: any, { id }: any, { models }: any) => {
				return await models.Category.destroy({ where: { id } })
			}
		),

		updateCategory: combineResolvers(
			isAuthenticated,
			isAdmin,
			async (_: any, { id, data: { name } }: any, { models }: any) => {
				await models.Category.update({ name }, { where: { id } })
				return await models.Category.findByPk(id)
			}
		)
	},

	Product: {
		products: async (category: any, __: any, { loaders }: any) => {
			return await loaders.product.load(category.id)
		}
	}
}
