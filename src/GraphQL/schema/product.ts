import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		products: [Product!]
		product(id: ID!): Product
	}

	extend type Mutation {
		addProduct(data: productInput): Product!
		deleteProduct(id: ID!): Boolean!
		updateProduct(id: ID!): Product!
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
		products: [Product!]
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
	}
`
