import { gql } from 'apollo-server-express'

export default gql`
	extend type Query {
		overview: OverviewData!
	}
	type OverviewData {
		totalProducts: Int!
		totalUsers: Int!
		totalCategory: Int!
	}
`
