import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Grid, GridColumn } from '@atlaskit/page'
import { Divider } from 'antd'

import profileRoutes from './profileRoutes'
import { AuthConsumer } from '../../../../context/authContext'
import ProfilePicture from './ProfilePicture'
import ProfileInfo from './ProfileInfo'
import ChangePassword from './ChangePassword'

class ProfileOverview extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(profileRoutes.id)
	}

	render() {
		return (
			<>
				<AuthConsumer>
					{({ setUser, user }) => (
						<>
							<Divider>Profile Image</Divider>
							<Grid spacing="comfortable">
								<GridColumn medium={5} />
								<GridColumn medium={5}>
									<ProfilePicture setUser={setUser} user={user} />
								</GridColumn>
								<GridColumn medium={2} />
							</Grid>
							<Divider>Profile Info</Divider>
							<Grid spacing="comfortable">
								<GridColumn medium={5} />
								<GridColumn medium={5}>
									<ProfileInfo setUser={setUser} user={user} />
								</GridColumn>
								<GridColumn medium={5} />
							</Grid>
							<Divider>Change Password</Divider>
							<Grid spacing="comfortable">
								<GridColumn medium={5} />
								<GridColumn medium={5}>
									<ChangePassword setUser={setUser} user={user} />
								</GridColumn>
								<GridColumn medium={2} />
							</Grid>
						</>
					)}
				</AuthConsumer>
			</>
		)
	}
}

export default withNavigationViewController(ProfileOverview)
