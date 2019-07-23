import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		users: [User!]
		user(id: ID!): User
		me: User
	}

	extend type Mutation {
		signUp(data: signUpInput): Token!
		signIn(login: String!, password: String!): Token!
		changeProfileImage(image: Upload!): Image!
		updateProfile(data: updateProfileInput): User!
		changeUserRole(id: ID!, role: Role!): User!
		changePassword(currentPassword: String!, newPassword: String!): Token!
		deleteUser(id: ID!): Boolean!
		deleteMe: Boolean!
	}

	type Token {
		token: String!
	}

	type User {
		id: ID!
		full_name: String!
		user_name: String!
		email: String!
		phone: String!
		role: Role!
		image: Image
		division: String!
		region: String!
		address: String!
		messages: [Message!]
		products: [Product!]
		createdAt: Date!
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

	input signUpInput {
		full_name: String!
		user_name: String!
		email: String!
		phone: String!
		password: String!
		role: Role
		division: String!
		region: String!
		address: String!
	}

	input updateProfileInput {
		full_name: String
		phone: String
		division: String
		region: String
		address: String
	}

	enum Role {
		ADMIN
		PARTNER
		CONSUMER
	}
`
