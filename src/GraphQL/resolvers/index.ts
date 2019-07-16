import { GraphQLDateTime } from 'graphql-iso-date'

import userResolvers from './user'
import messageResolvers from './message'
import categoryResolvers from './category'
import productResolvers from './product'

const customScalarResolver = {
	Date: GraphQLDateTime
}

export default [
	customScalarResolver,
	userResolvers,
	messageResolvers,
	categoryResolvers,
	productResolvers
]
