import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		products(offset: Int, cursor: String, limit: Int): ProductConnection!
		product(id: ID!): Product
	}

	extend type Mutation {
		addProduct(data: productInput): Product!
		deleteProduct(id: ID!): Boolean!
		updateProduct(id: ID!): Product!
	}

	type ProductConnection {
		edges: [Product!]!
		pageInfo: ProductPageInfo!
	}

	type ProductPageInfo {
		hasNextPage: Boolean!
		endCursor: String!
	}

	type Product {
		id: ID!
		name: String!
		quantity: String!
		quantity_extension: String!
		price: Float!
		price_extension: String!
		available_now: Boolean!
		retailable: Boolean!
		description: String!
		gov_price: Float!
		gov_price_extension: String!
		user: User!
		category: Category!
	}

	input productInput {
		name: String!
		quantity: Int!
		quantity_extension: String!
		price: Float!
		price_extension: String!
		available_now: Boolean!
		retailable: Boolean!
		description: String!
		gov_price: Float!
		gov_price_extension: String!
		categoryId: ID!
	}
`
