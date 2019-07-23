import React from 'react'
import { DrawerSkeletonHeader, DrawerSkeletonItem } from '@atlaskit/drawer'

export const DrawerSkeleton = () => (
	<>
		<DrawerSkeletonHeader isAvatarHidden />
		<DrawerSkeletonItem isAvatarHidden itemTextWidth="95vw" />
		<DrawerSkeletonItem isAvatarHidden itemTextWidth="95vw" />
		<DrawerSkeletonItem isAvatarHidden itemTextWidth="95vw" />
		<DrawerSkeletonItem isAvatarHidden itemTextWidth="95vw" />
	</>
)
