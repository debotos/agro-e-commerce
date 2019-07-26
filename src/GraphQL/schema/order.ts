import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		pendingOrders(page: Int, limit: Int): OrderConnection! #  pending: true
		acceptedOrders(page: Int, limit: Int): OrderConnection! # pending: false & accepted: true
		rejectedOrders(page: Int, limit: Int): OrderConnection! # pending: false & accepted: false
		completeOrders(page: Int, limit: Int): OrderConnection! # complete: true
		buyerOrders(buyer_id: ID!, offset: Int, cursor: String, limit: Int): OrderConnection! # buyer_id: ID & complete: false
		buyerHistory(buyer_id: ID!, offset: Int, cursor: String, limit: Int): OrderConnection! # buyer_id: ID & complete: true
		sellerOrders(seller_id: ID!, offset: Int, cursor: String, limit: Int): OrderConnection! # seller_id: ID & complete: false
		sellerHistory(seller_id: ID!, offset: Int, cursor: String, limit: Int): OrderConnection! # seller_id: ID & complete: true
		order(id: ID!): Order!
	}

	extend type Mutation {
		createOrder(data: orderCreateInput): Order!
		acceptOrder(id: ID!): Boolean!
		rejectOrder(id: ID!): Boolean!
		deleteOrder(id: ID!): Boolean! # buyer can delete it only if it is pending: true
		cancelOrder(id: ID!): Boolean! # Only Seller can cencel the order. accepted: false
		updateOrder(id: ID!, data: orderUpdateInput): Order! # only buyer of this order can update the quantity and price
		completeOrder(id: ID!): Boolean!
	}

	type OrderConnection {
		edges: [Order!]!
		pageInfo: OrderPageInfo!
	}

	type OrderPageInfo {
		hasNextPage: Boolean!
		endCursor: String!
	}

	type Order {
		id: ID!
		pending: Boolean!
		accepted: Boolean!
		buyer_id: ID!
		seller_id: ID!
		product_id: ID!
		createdAt: Date!
		delivery_date: Date!
		complete: Boolean!
		complete_date: Date
		quantity: Int!
		quantity_extension: String!
		price: Float!
		price_extension: String!
		buyer: User
		seller: User
		product: Product
		# Basic info for the UI(if user or product is deleted then it can be helpful)
		buyer_name: String!
		seller_name: String!
		product_name: String!
	}

	input orderCreateInput {
		product_id: ID!
		delivery_date: Date!
		quantity: Int!
		quantity_extension: String!
		price: Float!
		price_extension: String!
	}

	input orderUpdateInput {
		quantity: Int!
		price: Float!
		delivery_date: Date!
	}

	extend type Subscription {
		orderCreated: OrderCreated!
	}

	type OrderCreated {
		order: Order!
	}
`
