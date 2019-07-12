import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		users: [User!]
		user(id: ID!): User
		me: User
	}

	extend type Mutation {
		signUp(username: String!, email: String!, password: String!, role: Role): Token!
		signIn(login: String!, password: String!): Token!
		changeProfileImage(image: Upload!): Image!
		deleteUser(id: ID!): Boolean!
	}

	type Token {
		token: String!
	}

	enum Role {
		ADMIN
		PARTNER
		CONSUMER
	}

	type User {
		id: ID!
		username: String!
		email: String!
		role: Role!
		image: Image
		messages: [Message!]
	}

	type Image {
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
`
