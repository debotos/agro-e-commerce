import { combineResolvers } from 'graphql-resolvers'

import { isAdmin } from './middleware/authorization'

export default {
	Query: {
		overview: combineResolvers(isAdmin, async (_: any, __: any, { models }: any) => {
			const totalProducts = await models.Product.count()
			const totalUsers = await models.User.count()
			const totalCategory = await models.Category.count()
			return { totalProducts, totalUsers, totalCategory }
		})
	}
}
