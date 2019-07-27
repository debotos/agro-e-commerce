import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Grid, GridColumn } from '@atlaskit/page'
import { Divider, Tag } from 'antd'

import profileRoutes from './profileRoutes'
import { AuthConsumer } from '../../../../context/authContext'
import ProfilePicture from './ProfilePicture'
import ProfileInfo from './ProfileInfo'
import ChangePassword from './ChangePassword'
import { CenterHorizontal } from '../../../../components/Common'

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
							<CenterHorizontal>
								<Tag color="#f50">{user.role}</Tag>
							</CenterHorizontal>
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
								<GridColumn medium={3} />
								<GridColumn medium={7}>
									<ProfileInfo setUser={setUser} user={user} />
								</GridColumn>
								<GridColumn medium={2} />
							</Grid>
							<Divider>Change Password</Divider>
							<Grid spacing="comfortable">
								<GridColumn medium={3} />
								<GridColumn medium={7}>
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
