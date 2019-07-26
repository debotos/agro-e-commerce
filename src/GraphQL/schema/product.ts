import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		products(
			limit: Int
			offset: Int
			cursor: String
			searchText: String
			categoryId: String
			userId: String
		): ProductConnection!
		product(id: ID!): Product
	}

	extend type Mutation {
		addProduct(data: productAddInput): Product!
		addProductImage(id: ID!, image: Upload!): ProductImage! # id refers to Product ID
		addProductImages(id: ID!, images: [Upload!]): [ProductImage!] # id refers to Product ID
		deleteProduct(id: ID!): DeleteProduct!
		deleteProductImage(id: ID!, image_public_id: ID!): Boolean! # id refers to Product ID
		updateProduct(id: ID!, data: productUpdateInput): Product!
	}

	type DeleteProduct {
		success: Boolean!
		id: ID!
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
		quantity: Int! # This one is for Max quantity
		quantity_extension: String!
		min_quantity: Int!
		min_quantity_extension: String!
		price: Float!
		price_extension: String!
		available_now: Boolean!
		retailable: Boolean!
		description: String!
		gov_price: Float!
		gov_price_extension: String!
		images: [ProductImage!]
		user: User!
		category: Category!
	}

	type ProductImage {
		public_id: String!
		version: Int
		signature: String
		width: Int
		height: Int
		format: String
		resource_type: String
		created_at: Date
		tags: [String]
		bytes: Int
		type: String
		url: String!
		secure_url: String!
	}

	input productAddInput {
		name: String!
		quantity: Int!
		quantity_extension: String!
		min_quantity: Int!
		min_quantity_extension: String!
		price: Float!
		price_extension: String!
		available_now: Boolean!
		retailable: Boolean!
		description: String!
		gov_price: Float!
		gov_price_extension: String!
		categoryId: ID!
	}

	input productUpdateInput {
		name: String!
		quantity: Int!
		quantity_extension: String!
		min_quantity: Int!
		min_quantity_extension: String!
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
