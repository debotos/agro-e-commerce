import React from 'react'
import { Spin } from 'antd'

/* 'large', '', 'small' */
export default ({ size }) => (
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
		<Spin size={size} />
	</div>
)
