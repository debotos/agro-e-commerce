import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import profileRoutes from './profileRoutes'

class ProfileOverview extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(profileRoutes.id)
	}

	render() {
		return (
			<div css={{ padding: 30 }}>
				<h1>Profile </h1>
			</div>
		)
	}
}

export default withNavigationViewController(ProfileOverview)
