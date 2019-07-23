import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		categories: [Category!]
		category(id: ID!): Category
	}

	extend type Mutation {
		addCategory(data: categoryAddInput): Category!
		deleteCategory(id: ID!): DeleteCategory!
		updateCategory(id: ID!, data: categoryUpdateInput): Category!
	}

	type DeleteCategory {
		success: Boolean!
		id: ID!
	}

	type Category {
		id: ID!
		name: String!
		image: String!
		products: [Product!]
	}

	input categoryAddInput {
		name: String!
		image: Upload!
	}

	input categoryUpdateInput {
		name: String
		image: Upload
	}
`
