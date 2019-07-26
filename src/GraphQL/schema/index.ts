import { gql } from 'apollo-server-express'

import overviewSchema from './overview'
import userSchema from './user'
import messageSchema from './message'
import categorySchema from './category'
import productSchema from './product'
import orderSchema from './order'

const linkSchema = gql`
	scalar Date

	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}

	type Subscription {
		_: Boolean
	}
`

export default [
	linkSchema,
	userSchema,
	categorySchema,
	productSchema,
	messageSchema,
	overviewSchema,
	orderSchema
]
