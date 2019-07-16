import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		categories: [Category!]
		category(id: ID!): Category
	}

	extend type Mutation {
		addCategory(data: categoryAddInput): Category!
		deleteCategory(id: ID!): Boolean!
		updateCategory(id: ID!, data: categoryUpdateInput): Category!
	}

	type Category {
		id: ID!
		name: String!
		products: [Product!]
	}

	input categoryAddInput {
		name: String!
	}

	input categoryUpdateInput {
		name: String!
	}
`