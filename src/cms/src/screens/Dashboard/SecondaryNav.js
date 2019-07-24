import DashboardIcon from '@atlaskit/icon/glyph/dashboard'
import SuitcaseIcon from '@atlaskit/icon/glyph/suitcase'
import PersonCircleIcon from '@atlaskit/icon/glyph/person-circle'
import PreferencesIcon from '@atlaskit/icon/glyph/preferences'
import MentionIcon from '@atlaskit/icon/glyph/mention';

import { LinkItem } from './index'

export const secondaryNav = {
	id: 'product/home',
	type: 'product' /* This is 'atlaskit' defined type, not customizable */,
	getItems: () => [
		{
			type: 'HeaderSection',
			id: 'product/home:header',
			items: [
				{
					type: 'SectionHeading',
					id: 'agro-e-commerce-label',
					text: 'ADMIN CMS'
				}
			]
		},
		{
			type: 'MenuSection',
			nestedGroupKey: 'menu',
			id: 'product/home:menu',
			parentId: null,
			items: [
				{
					type: 'InlineComponent',
					component: LinkItem,
					id: 'dashboards',
					before: DashboardIcon,
					text: 'Overview',
					to: '/'
				},
				{
					type: 'Item',
					id: 'profile-actions',
					goTo: 'product/profile',
					before: MentionIcon,
					text: 'My Account'
				},
				{
					type: 'Item',
					id: 'category-actions',
					goTo: 'product/category',
					before: SuitcaseIcon,
					text: 'Category Actions'
				},
				{
					type: 'Item',
					id: 'user-actions',
					goTo: 'product/user',
					before: PersonCircleIcon,
					text: 'User Actions'
				},
				{
					type: 'Item',
					id: 'settings',
					goTo: 'product/settings',
					before: PreferencesIcon,
					text: 'All Settings'
				}
			]
		}
	]
}
