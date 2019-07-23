import React from 'react'
import Avatar from '@atlaskit/avatar'
import { Form, Input, Button, Table, Icon, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words'
import moment from 'moment'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import cropCloudinayImage from '../../../../utils/cropImage'
import InlineLoader from '../../../../assets/loader/inline-loader.gif'

const Header = styled.p`
	font-size: 15px;
	span {
		font-weight: bold;
	}
`
class Cell extends React.Component {
	renderDataView = (children, record, field) => {
		switch (field) {
			case 'image':
				return record[field] ? (
					<Avatar
						name={record['user_name']}
						size="medium"
						src={cropCloudinayImage(record[field], 80, 80)}
					/>
				) : (
					<Avatar borderColor="transparent" isActive={false} isHover={false} size="small" />
				)
			case 'createdAt':
				return `${moment(record[field]).format('ddd, MMM Do YY')} `
			default:
				return children
		}
	}

	renderCell = () => {
		const { dataIndex, title, record, index, children, ...restProps } = this.props
		return <td {...restProps}>{this.renderDataView(children, record, dataIndex)}</td>
	}

	render() {
		return this.renderCell()
	}
}

class TableView extends React.Component {
	constructor(props) {
		super(props)
		this.columns = [
			{
				title: 'Serial',
				dataIndex: 'serial',
				width: '5%',
				sorter: (a, b) => a.serial - b.serial
			},
			{
				title: 'Avatar',
				dataIndex: 'image',
				width: '5%'
			},
			{
				title: 'Type',
				dataIndex: 'role',
				width: '5%',
				filters: [
					{ text: 'ADMIN', value: 'ADMIN' },
					{ text: 'PARTNER', value: 'PARTNER' },
					{ text: 'CONSUMER', value: 'CONSUMER' }
				],
				onFilter: (value, record) => record.role.includes(value)
			},
			{
				title: 'Full Name',
				dataIndex: 'full_name',
				width: '10%',
				...this.getColumnSearchProps('full_name')
			},
			{
				title: 'User Name',
				dataIndex: 'user_name',
				width: '8%',
				...this.getColumnSearchProps('user_name')
			},
			{
				title: 'Email',
				dataIndex: 'email',
				width: '15%',
				...this.getColumnSearchProps('email')
			},
			{
				title: 'Phone Number',
				dataIndex: 'phone',
				width: '10%',
				...this.getColumnSearchProps('phone')
			},

			{
				title: 'Division',
				dataIndex: 'division',
				width: '8%',
				...this.getColumnSearchProps('division')
			},
			{
				title: 'Region',
				dataIndex: 'region',
				width: '8%',
				...this.getColumnSearchProps('region')
			},
			{
				title: 'Address',
				dataIndex: 'address',
				width: '14%',
				...this.getColumnSearchProps('address')
			},
			{
				title: 'Joining Date',
				dataIndex: 'createdAt',
				width: '15%',
				sorter: (a, b) => a.createdAt - b.createdAt
			},

			{
				title: 'Action',
				dataIndex: 'operation',
				render: (text, record) => {
					return this.props.deleteUserLoading ? (
						<img alt="User deleting..." src={InlineLoader} style={{ marginLeft: 12 }} />
					) : (
						<span>
							<Link style={{ marginLeft: 8, color: '#0D4EA6' }} to={`/user/${record.key}`}>
								View
							</Link>

							<Popconfirm
								title={`Sure to delete? All the products of this user will be deleted also!`}
								icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
								onConfirm={() => this.props.deleteUser({ variables: { id: record.key } })}
							>
								{/* eslint-disable-next-line */}
								<a href="javascript:;" style={{ marginLeft: 8, color: '#e26a6a' }}>
									Delete
								</a>
							</Popconfirm>
						</span>
					)
				}
			}
		]
	}

	state = {
		searchText: ''
	}

	handleSearch = (selectedKeys, confirm) => {
		confirm()
		this.setState({ searchText: selectedKeys[0] })
	}

	handleReset = clearFilters => {
		clearFilters()
		this.setState({ searchText: '' })
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select())
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		)
	})

	render() {
		const components = { body: { cell: Cell } }
		const columns = this.columns.map(col => {
			return {
				...col,
				onCell: record => ({
					record,
					dataIndex: col.dataIndex,
					title: col.title
				})
			}
		})
		return (
			<Table
				size="small"
				components={components}
				bordered
				dataSource={this.props.data}
				columns={columns}
				rowClassName="users-table-row"
				title={() => (
					<Header>
						Total <span>{this.props.data.length}</span> User{this.props.data.length > 1 ? 's' : ''}
					</Header>
				)}
				pagination={{
					pageSize: 15,
					position: 'both',
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ['10', '15', '20', '30', '50', '80', '100']
				}}
			/>
		)
	}
}

const UsersTable = Form.create()(TableView)

export default UsersTable
