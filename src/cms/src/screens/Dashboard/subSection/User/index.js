import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

import userRoutes from './userRoutes'
import UsersTable from './UsersTable'
import { notifyGraphQLError, notifyError } from '../../../../utils/notify'
import { AuthConsumer } from '../../../../context/authContext'
import Loading from '../../../../components/Loading'
import { GET_OVERVIEW } from '../overview'

export const GET_USERS = gql`
	query {
		users {
			id
			full_name
			user_name
			email
			phone
			role
			image {
				secure_url
			}
			region
			division
			address
			createdAt
		}
	}
`

const DELETE_USER = gql`
	mutation($id: ID!) {
		deleteUser(id: $id) {
			success
			id
		}
	}
`

class UsersList extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(userRoutes.id)
	}

	render() {
		return (
			<>
				<AuthConsumer>
					{({ setUser, user }) => (
						<>
							<Query
								query={GET_USERS}
								notifyOnNetworkStatusChange
								pollInterval={1000 * 60 * 5}
								skip={window.location.hash !== '#/users'}
								onError={error => {
									const notice = notifyGraphQLError(error)
									if (notice && notice.logoutAction) {
										setTimeout(() => setUser(null), 3500)
									}
								}}
							>
								{({ loading, error, data }) => {
									if (error) return null
									if (loading) return <Loading size="large" />
									if (data && data.users) {
										const users = data.users
											.filter(x => x.id !== user.id)
											.map((x, i) => ({
												...x,
												key: x.id,
												serial: i + 1,
												image: x.image ? x.image.secure_url : null
											}))

										return (
											<Mutation
												mutation={DELETE_USER}
												refetchQueries={() => [{ query: GET_OVERVIEW }]}
												onError={error => {
													const notice = notifyGraphQLError(error)
													if (notice && notice.logoutAction) {
														setTimeout(() => setUser(null), 3500)
													}
												}}
												update={(cache, { data: { deleteUser } }) => {
													const { users } = cache.readQuery({ query: GET_USERS })
													if (deleteUser.success) {
														cache.writeQuery({
															query: GET_USERS,
															data: { users: users.filter(x => x.id !== deleteUser.id) }
														})
													} else {
														notifyError('Failed to delete the user.')
													}
												}}
											>
												{(deleteUser, { loading, data }) => (
													<UsersTable
														data={users}
														deleteUserLoading={loading}
														deleteUser={deleteUser}
													/>
												)}
											</Mutation>
										)
									} else {
										return null
									}
								}}
							</Query>
						</>
					)}
				</AuthConsumer>
			</>
		)
	}
}

export default withNavigationViewController(UsersList)
