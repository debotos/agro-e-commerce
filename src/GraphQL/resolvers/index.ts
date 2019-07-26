import { GraphQLDateTime } from 'graphql-iso-date'

import overviewResolvers from './overview'
import userResolvers from './user'
import messageResolvers from './message'
import categoryResolvers from './category'
import productResolvers from './product'
import orderResolvers from './order'

const customScalarResolver = {
	Date: GraphQLDateTime
}

export default [
	customScalarResolver,
	userResolvers,
	messageResolvers,
	categoryResolvers,
	productResolvers,
	overviewResolvers,
	orderResolvers
]
