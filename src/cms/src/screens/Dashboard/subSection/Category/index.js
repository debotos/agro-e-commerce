import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { GridColumn } from '@atlaskit/page'

import categoryRoutes from './categoryRoutes'
import AddCategory from './AddCategory'
import CategoriesTable from './CategoriesTable'
import { AuthConsumer } from '../../../../context/authContext'
import { Row } from '../../../../components/Common'

class Categories extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(categoryRoutes.id)
	}

	render() {
		return (
			<AuthConsumer>
				{({ setUser, user }) => (
					<>
						<Row>
							<GridColumn medium={4}>
								<AddCategory setUser={setUser} user={user} />
							</GridColumn>
							<GridColumn medium={8}>
								<CategoriesTable setUser={setUser} user={user} />
							</GridColumn>
						</Row>
					</>
				)}
			</AuthConsumer>
		)
	}
}

export default withNavigationViewController(Categories)
