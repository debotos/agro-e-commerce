import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@atlaskit/avatar'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'
import { GlobalNav } from '@atlaskit/navigation-next'

import AppLogo from '../../assets/logo/logo.png'
import { AuthConsumer } from '../../context/authContext'
import ApolloClient from '../../config/apolloClient'
import cropCloudinayImage from '../../utils/cropImage'

export const GlobalLink = ({ className, to, onClick, children }) => {
	return (
		<Link className={className} to={to} onClick={onClick}>
			{children}
		</Link>
	)
}

const globalNavPrimaryItems = [
	{
		id: 'main-app-logo',
		icon: () => <Avatar src={AppLogo} size="large" />,
		label: 'Overview',
		to: '/',
		component: GlobalLink
	}
]

const globalNavSecondaryItems = (setUser, image) => [
	{
		id: 'logout',
		icon: () => <SignOutIcon size="small" primaryColor="white" />,
		label: 'Logout',
		size: 'small',
		onClick: () => {
			console.log('Logout action called!')
			/* Logout Action */
			// 1. Remove 'AUTH_TOKEN' from localStorage
			localStorage.removeItem('AUTH_TOKEN')
			// 2. Set 'user: null' to authContext
			setUser(null)
			// 3. Clear Apollo-Client cache
			ApolloClient.resetStore()
		},
		tooltip: 'Logout from current session!'
	},
	{
		icon: () =>
			image ? (
				<Avatar
					src={cropCloudinayImage(image, 80, 80)}
					borderColor="transparent"
					isActive={false}
					isHover={false}
					size="medium"
				/>
			) : (
				<Avatar borderColor="transparent" isActive={false} isHover={false} size="medium" />
			),
		label: 'Profile',
		size: 'medium',
		id: 'profile',
		tooltip: 'View Profile',
		to: '/profile',
		component: GlobalLink
	}
]

// ==============================
// Simple global navigation
// ==============================

export default class GlobalNavigation extends PureComponent {
	render() {
		return (
			<AuthConsumer>
				{({ user: { image }, setUser }) => {
					return (
						<GlobalNav
							primaryItems={globalNavPrimaryItems}
							secondaryItems={globalNavSecondaryItems(setUser, image)}
						/>
					)
				}}
			</AuthConsumer>
		)
	}
}
