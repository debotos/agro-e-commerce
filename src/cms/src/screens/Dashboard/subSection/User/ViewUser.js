import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import userRoutes from './userRoutes'
import { notifyGraphQLError } from '../../../../utils/notify'
import { AuthConsumer } from '../../../../context/authContext'
import Loading from '../../../../components/Loading'
import ViewUserInfo from './ViewUserInfo'

export const GET_USER = gql`
	query($id: ID!) {
		user(id: $id) {
			id
			full_name
			user_name
			email
			phone
			role
			image {
				secure_url
			}
			division
			region
			address
			createdAt
		}
	}
`

class ViewUser extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(userRoutes.id)
	}

	render() {
		const userId = this.props.match.params.id
		if (!userId) return <h5>Invalid path. No user id provided.</h5>
		return (
			<>
				<AuthConsumer>
					{({ setUser, user }) => (
						<>
							<Query
								query={GET_USER}
								variables={{ id: userId }}
								notifyOnNetworkStatusChange
								pollInterval={1000 * 60 * 5}
								skip={!window.location.hash.includes('#/user/')}
								onError={error => {
									const notice = notifyGraphQLError(error)
									if (notice && notice.logoutAction) {
										setTimeout(() => setUser(null), 3500)
									}
								}}
							>
								{({ loading, error, data }) => {
									if (error) return <h1>Something is wrong.</h1>
									if (loading) return <Loading size="large" />
									if (data) {
										return (
											<>
												<ViewUserInfo user={data.user} />
												{/* Here, put the user products table with productDelete mutation */}
											</>
										)
									}
									return <h1>Nothing to view.</h1>
								}}
							</Query>
						</>
					)}
				</AuthConsumer>
			</>
		)
	}
}

export default withNavigationViewController(ViewUser)
