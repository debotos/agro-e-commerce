import Sequelize from 'sequelize'
import { combineResolvers } from 'graphql-resolvers'
import { UserInputError } from 'apollo-server'

import { isAuthenticated, isProductOwner } from './middleware/authorization'
import { toCursorHash, fromCursorHash } from '../utils/cursor'

export default {
	Query: {
		products: async (_: any, { cursor, offset = 0, limit = 10 }: any, { models }: any) => {
			/* 
				The first page only retrieves the most recent products in the list, 
				so you can use the creation date of the last product as a cursor for the next page of products.
			*/
			const messages = await models.Product.findAll({
				order: [
					['createdAt', 'DESC']
				] /* First, the list should be ordered by createdAt date, otherwise the cursor won’t help */,
				offset,
				limit: limit + 1 /* Added 1 to calculate hasNextPage: Boolean! value */,
				where: cursor /* Second, the ternary operator for the cursor makes sure the cursor isn’t needed for the first page request */
					? {
							createdAt: {
								[Sequelize.Op.lt]: fromCursorHash(cursor)
							}
					  }
					: null
			})

			const hasNextPage = messages.length > limit
			const edges = hasNextPage ? messages.slice(0, -1) : messages

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
			return await models.Product.findByPk(id)
		}
	},

	Mutation: {
		addProduct: combineResolvers(
			isAuthenticated,
			async (_: any, { data }: any, { me, models }: any) => {
				const category = await models.Category.findByPk(data.categoryId)
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
				return await models.Product.destroy({ where: { id } })
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
