import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'

import categoryRoutes from './categoryRoutes'

class ViewCategory extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(categoryRoutes.id)
	}
	render() {
		return <div>View Category Details</div>
	}
}

export default withNavigationViewController(ViewCategory)
