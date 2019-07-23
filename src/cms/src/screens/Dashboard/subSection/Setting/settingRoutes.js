import { LinkItem } from '../../index'

export default {
	id: 'product/settings',
	type: 'product',
	getItems: () => [
		{
			type: 'HeaderSection',
			id: 'product/settings:header',
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
			id: 'product/settings:menu',
			parentId: 'product/home:menu',
			alwaysShowScrollHint: true,
			items: [
				{
					type: 'SectionHeading',
					text: 'Settings',
					id: 'settings-and-filters-heading'
				},
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'settings',
					text: 'Settings Overview',
					to: '/settings'
				}
			]
		}
	]
}
