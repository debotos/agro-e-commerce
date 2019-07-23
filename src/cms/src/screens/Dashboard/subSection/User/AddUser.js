import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import userRoutes from './userRoutes'

class AddUser extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(userRoutes.id)
	}
	render() {
		return <div>Add New User</div>
	}
}

export default withNavigationViewController(AddUser)
