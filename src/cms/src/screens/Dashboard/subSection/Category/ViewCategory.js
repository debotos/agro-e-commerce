import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import categoryRoutes from './categoryRoutes'
import { notifyGraphQLError } from '../../../../utils/notify'
import { AuthConsumer } from '../../../../context/authContext'
import UpdateCategory from './UpdateCategory'
import ProductsTable from './ProductsTable'
import Loading from '../../../../components/Loading'

export const GET_CATEGORY = gql`
	query($id: ID!) {
		category(id: $id) {
			id
			name
			image
			products {
				id
				name
				quantity
				quantity_extension
				price
				price_extension
				available_now
				retailable
				gov_price
				gov_price_extension
				images {
					secure_url
				}
				user {
					user_name
					id
				}
			}
		}
	}
`

class ViewCategory extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(categoryRoutes.id)
	}
	render() {
		const categoryId = this.props.match.params.id
		return (
			<AuthConsumer>
				{({ setUser, user }) => (
					<>
						<Query
							query={GET_CATEGORY}
							variables={{ id: categoryId }}
							notifyOnNetworkStatusChange
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
								if (data && Object.keys(data.category).length > 0) {
									const { category } = data
									const currentImage = {
										uid: category.id,
										name: category.name,
										status: 'done',
										url: category.image
									}

									const products = category.products.map((x, i) => ({ ...x, key: x.id }))
									return (
										<>
											<UpdateCategory
												setUser={setUser}
												user={user}
												data={category}
												categoryId={category.id}
												currentImage={currentImage}
											/>

											<ProductsTable
												setUser={setUser}
												user={user}
												products={products}
												categoryId={category.id}
											/>
										</>
									)
								}
							}}
						</Query>
					</>
				)}
			</AuthConsumer>
		)
	}
}

export default withNavigationViewController(ViewCategory)
