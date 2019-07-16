import { gql } from 'apollo-server-express'

import userSchema from './user'
import messageSchema from './message'
import categorySchema from './category'
import productSchema from './product'

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

export default [linkSchema, userSchema, categorySchema, productSchema, messageSchema]
