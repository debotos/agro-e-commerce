import React, { PureComponent, Component } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@atlaskit/avatar'
import SignOutIcon from '@atlaskit/icon/glyph/sign-out'
// import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle'
import { DropdownItem, DropdownItemGroup, DropdownMenuStateless } from '@atlaskit/dropdown-menu'
import { GlobalItem, GlobalNav } from '@atlaskit/navigation-next'

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

const ItemComponent = ({ dropdownItems: DropdownItems, ...itemProps }) => {
	if (DropdownItems) {
		return (
			<GlobalItemWithDropdown
				trigger={({ isOpen }) => <GlobalItem isSelected={isOpen} {...itemProps} />}
				items={<DropdownItems />}
			/>
		)
	}
	return <GlobalItem {...itemProps} />
}

const globalNavPrimaryItems = [
	{
		id: 'jira',
		icon: () => <Avatar src={AppLogo} size="large" />,
		label: 'Jira',
		to: '/',
		component: GlobalLink
	}
]

const globalNavSecondaryItems = [
	// { id: 'help', icon: QuestionCircleIcon, label: 'Help', size: 'small' },
	{
		icon: () => (
			<AuthConsumer>
				{({ user: { image } }) =>
					image ? (
						<Avatar
							src={cropCloudinayImage(image, 80, 80)}
							borderColor="transparent"
							isActive={false}
							isHover={false}
							size="small"
						/>
					) : (
						<Avatar borderColor="transparent" isActive={false} isHover={false} size="small" />
					)
				}
			</AuthConsumer>
		),
		label: 'Profile',
		size: 'small',
		id: 'profile',
		tooltip: 'Profile Actions',
		dropdownItems: () => (
			<AuthConsumer>
				{({ user: { user_name }, setUser }) => (
					<DropdownItemGroup title={user_name}>
						<DropdownItem>
							<div
								style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
								onClick={() => {
									/* Logout Action */
									// 1. Remove 'AUTH_TOKEN' from localStorage
									localStorage.removeItem('AUTH_TOKEN')
									// 2. Set 'user: null' to authContext
									setUser(null)
									// 3. Clear Apollo-Client cache
									ApolloClient.resetStore()
								}}
							>
								<SignOutIcon size="small" primaryColor="red" />
								<span style={{ marginLeft: 5, fontWeight: 'bolder', opacity: 0.8 }}>Logout</span>
							</div>
						</DropdownItem>
					</DropdownItemGroup>
				)}
			</AuthConsumer>
		)
	}
]

class GlobalItemWithDropdown extends Component {
	state = {
		isOpen: false
	}

	handleOpenChange = ({ isOpen }) => this.setState({ isOpen })

	render() {
		const { items, trigger: Trigger } = this.props
		const { isOpen } = this.state
		return (
			<DropdownMenuStateless
				boundariesElement="window"
				isOpen={isOpen}
				onOpenChange={this.handleOpenChange}
				position="right bottom"
				trigger={<Trigger isOpen={isOpen} />}
			>
				{items}
			</DropdownMenuStateless>
		)
	}
}

// ==============================
// Simple global navigation
// ==============================

export default class GlobalNavigation extends PureComponent {
	render() {
		return (
			<GlobalNav
				itemComponent={ItemComponent}
				primaryItems={globalNavPrimaryItems}
				secondaryItems={globalNavSecondaryItems}
			/>
		)
	}
}
