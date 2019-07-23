import React, { Component } from 'react'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import { Grid, GridColumn } from '@atlaskit/page'
import styled from 'styled-components'
import numeral from 'numeral'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { secondaryNav } from '../../SecondaryNav'
import { Card } from '../../../../components/Card'
import { Center } from '../../../../components/Common'
import { Divider } from '../../../../components/Divider'
import { notifyGraphQLError } from '../../../../utils/notify'
import { AuthConsumer } from '../../../../context/authContext'

const Title = styled.h2`
	font-size: 30px;
	font-weight: 500;
	opacity: 0.7;
`

const Count = styled.span`
	font-size: 4.5rem;
	opacity: 0.8;
`

export const GET_OVERVIEW = gql`
	query {
		overview {
			totalUsers
			totalProducts
		}
	}
`

class DashboardsRouteBase extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(secondaryNav.id)
	}

	render() {
		return (
			<>
				<AuthConsumer>
					{({ setUser }) => (
						<>
							<Grid>
								<Query
									query={GET_OVERVIEW}
									pollInterval={10000}
									notifyOnNetworkStatusChange
									skip={window.location.hash !== '#/'}
									onError={error => {
										const notice = notifyGraphQLError(error)
										if (notice && notice.logoutAction) {
											setTimeout(() => setUser(null), 3500)
										}
									}}
								>
									{({ loading, error, data }) => {
										if (error) return null
										if (data) {
											// console.log(data)
											let totalUsers, totalProducts
											if (!loading && data.overview) {
												totalUsers = data.overview.totalUsers
												totalProducts = data.overview.totalProducts
											}
											return (
												<>
													<GridColumn medium={6}>
														<Card>
															<Title>Total Products</Title>
															<Divider />
															<Center fullHeight={true}>
																<Count>
																	{totalProducts && numeral(totalProducts).format('0,0')}
																</Count>
															</Center>
														</Card>
													</GridColumn>
													<GridColumn medium={6}>
														<Card>
															<Title>Total Users</Title>
															<Divider />
															<Center fullHeight={true}>
																<Count>{totalUsers && numeral(totalUsers).format('0,0')}</Count>
															</Center>
														</Card>
													</GridColumn>
												</>
											)
										}
									}}
								</Query>
							</Grid>
							{/* <Grid>
								<GridColumn medium={6}>
									<Card>Something</Card>
								</GridColumn>
								<GridColumn medium={6}>
									<Card>Something</Card>
								</GridColumn>
							</Grid> */}
						</>
					)}
				</AuthConsumer>
			</>
		)
	}
}

const DashboardsRoute = withNavigationViewController(DashboardsRouteBase)

export default DashboardsRoute
