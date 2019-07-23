import { LinkItem } from '../../index'

export default {
	id: 'product/user',
	type: 'product',
	getItems: () => [
		{
			type: 'HeaderSection',
			id: 'product/user:header',
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
			id: 'product/user:menu',
			parentId: 'product/home:menu',
			alwaysShowScrollHint: true,
			items: [
				{
					type: 'SectionHeading',
					text: 'Users and filters',
					id: 'user-and-filters-heading'
				},
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'user-list',
					text: 'All Users',
					to: '/users'
				},
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'add-user',
					text: 'Add New User',
					to: '/user/add'
				}
			]
		}
	]
}
