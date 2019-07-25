import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Grid, GridColumn } from '@atlaskit/page'
import Avatar from '@atlaskit/avatar'
import Button from '@atlaskit/button'
import { RadioGroup } from '@atlaskit/radio'
import moment from 'moment'

import { notifyError, notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
import { GET_USER } from './ViewUser'
import cropCloudinayImage from '../../../../utils/cropImage'

const CHANGE_ROLE = gql`
	mutation($id: ID!, $role: Role!) {
		changeUserRole(id: $id, role: $role) {
			role
		}
	}
`
const UserRoles = [
	{ name: 'UserRole', value: 'ADMIN', label: 'ADMIN' },
	{ name: 'UserRole', value: 'PARTNER', label: 'PARTNER' },
	{ name: 'UserRole', value: 'CONSUMER', label: 'CONSUMER' }
]

class ViewUserInfo extends Component {
	state = {
		value: this.props.user.role /* User Role Value */
	}

	setRoleValue = e => {
		const value = e.target.value
		this.setState({ value })
		console.log('Changing user role to: ', value)
	}

	render() {
		const {
			id,
			full_name,
			user_name,
			role,
			email,
			phone,
			image,
			division,
			region,
			address,
			createdAt
		} = this.props.user
		return (
			<>
				<Mutation
					mutation={CHANGE_ROLE}
					onError={error => {
						const notice = notifyGraphQLError(error)
						if (notice && notice.logoutAction) {
							setTimeout(() => this.props.setUser(null), 3500)
						}
					}}
					update={(cache, { data: { changeUserRole } }) => {
						const { user } = cache.readQuery({ query: GET_USER, variables: { id } })
						console.log(changeUserRole)
						if (changeUserRole.role) {
							user.role = changeUserRole.role
							cache.writeQuery({
								query: GET_USER,
								data: { user }
							})
							notifySuccess(`Role changed to '${changeUserRole.role}'`)
						} else {
							notifyError('Failed to update the role.')
						}
					}}
				>
					{(changeUserRole, { loading, data }) => (
						<Grid spacing="comfortable">
							<GridColumn medium={2}>
								<Avatar
									size="xlarge"
									name={full_name}
									src={image ? cropCloudinayImage(image.secure_url, 150, 150) : null}
									borderColor="transparent"
									isActive={false}
									isHover={false}
								/>
							</GridColumn>
							<GridColumn medium={4}>
								<h5>
									User ID: <strong>{id}</strong>
								</h5>
								<h5>
									Full Name: <strong>{full_name}</strong>
								</h5>
								<h5>
									User Name: <strong>{user_name}</strong>
								</h5>
								<h5>
									Email: <strong>{email}</strong>
								</h5>
								<h5>
									Phone: <strong>{phone}</strong>
								</h5>
							</GridColumn>
							<GridColumn medium={3}>
								<h5>
									City: <strong>{division}</strong>
								</h5>
								<h5>
									Post Code: <strong>{region}</strong>
								</h5>
								<h5>
									Address: <strong>{address}</strong>
								</h5>
								<h5>
									Joining Date: <strong>{moment(createdAt).format('ddd, MMM Do YY')}</strong>
								</h5>
							</GridColumn>
							<GridColumn medium={3}>
								<RadioGroup
									label="Change User Role:"
									onChange={this.setRoleValue}
									defaultValue={role}
									options={UserRoles}
								/>
								<Button
									type="submit"
									appearance="primary"
									style={{ margin: '5px 25px' }}
									isLoading={loading}
									isDisabled={role === this.state.value}
									onClick={() => changeUserRole({ variables: { id, role: this.state.value } })}
								>
									Update
								</Button>
							</GridColumn>
						</Grid>
					)}
				</Mutation>
			</>
		)
	}
}

export default ViewUserInfo
