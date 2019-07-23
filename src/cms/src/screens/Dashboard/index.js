/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react'
import { HashRouter, Link, Route, Switch } from 'react-router-dom'
import {
	LayoutManagerWithViewController,
	NavigationProvider,
	withNavigationViewController
} from '@atlaskit/navigation-next'

import GlobalNav from './GlobalNav' // 1'st part at the left most side
import userRoutes from './subSection/User/userRoutes'
import categoryRoutes from './subSection/Category/categoryRoutes'
import settingRoutes from './subSection/Setting/settingRoutes'
import { secondaryNav } from './SecondaryNav'

import OverviewRoute from './subSection/overview'
import Categories from './subSection/Category'
import ViewCategory from './subSection/Category/ViewCategory'
import Users from './subSection/User'
import AddUser from './subSection/User/AddUser'
import ViewUser from './subSection/User/ViewUser'
import Settings from './subSection/Setting'

class App extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.addView(secondaryNav)
		navigationViewController.addView(categoryRoutes)
		navigationViewController.addView(userRoutes)
		navigationViewController.addView(settingRoutes)
	}

	render() {
		return (
			<LayoutManagerWithViewController globalNavigation={GlobalNav}>
				<div style={{ padding: 40 }}>
					<Switch>
						<Route exact path="/categories" component={Categories} />
						<Route path="/category/:id" component={ViewCategory} />
						<Route path="/users" component={Users} />
						<Route path="/user/add" component={AddUser} />
						<Route path="/user/:id" component={ViewUser} />
						<Route path="/settings" component={Settings} />
						<Route path="/" component={OverviewRoute} />
					</Switch>
				</div>
			</LayoutManagerWithViewController>
		)
	}
}
const AppWithNavigationViewController = withNavigationViewController(App)

export default () => (
	<HashRouter>
		<NavigationProvider>
			<AppWithNavigationViewController />
		</NavigationProvider>
	</HashRouter>
)

/* Basic Component */
export const LinkItem = ({ components: { Item }, to, ...props }) => {
	return (
		<Route
			render={({ location: { pathname } }) => (
				<Item
					component={({ children, className }) => (
						<Link className={className} to={to}>
							{children}
						</Link>
					)}
					isSelected={pathname === to}
					{...props}
				/>
			)}
		/>
	)
}
