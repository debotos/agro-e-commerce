import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import settingRoutes from './settingRoutes'

class SettingsOverview extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(settingRoutes.id)
	}

	render() {
		return (
			<div css={{ padding: 30 }}>
				<h1>Settings </h1>
			</div>
		)
	}
}

export default withNavigationViewController(SettingsOverview)
