import { LinkItem } from '../../index'

export default {
	id: 'product/profile',
	type: 'product',
	getItems: () => [
		{
			type: 'HeaderSection',
			id: 'product/profile:header',
			items: [
				{
					type: 'BackItem',
					id: 'back-item',
					goTo: 'product/home',
					text: 'Back'
				}
			]
		},
		{
			type: 'MenuSection',
			nestedGroupKey: 'menu',
			id: 'product/profile:menu',
			parentId: 'product/home:menu',
			alwaysShowScrollHint: true,
			items: [
				{
					type: 'SectionHeading',
					text: 'My Account',
					id: 'profile-and-filters-heading'
				},
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'profile',
					text: 'Profile Overview',
					to: '/profile'
				}
			]
		}
	]
}
