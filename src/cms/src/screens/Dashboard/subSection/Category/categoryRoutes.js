import { LinkItem } from '../../index'

export default {
	id: 'product/category',
	type: 'product',
	getItems: () => [
		{
			type: 'HeaderSection',
			id: 'product/category:header',
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
			id: 'product/category:menu',
			parentId: 'product/home:menu',
			alwaysShowScrollHint: true,
			items: [
				{
					type: 'SectionHeading',
					text: 'Category Actions',
					id: 'category-actions'
				},
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'category-list',
					text: 'Categories',
					to: '/categories'
				}
			]
		}
	]
}
