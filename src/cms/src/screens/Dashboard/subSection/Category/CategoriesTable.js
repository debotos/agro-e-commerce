import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import Avatar from '@atlaskit/avatar'
import { Form, Input, Button, Table, Icon, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words'
import numeral from 'numeral'
import moment from 'moment'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import cropCloudinayImage from '../../../../utils/cropImage'
import InlineLoader from '../../../../assets/loader/inline-loader.gif'
import { notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
import Loading from '../../../../components/Loading'

export const GET_CATEGORIES = gql`
	query {
		categories {
			id
			name
			image
		}
	}
`

class CategoriesTable extends Component {
	render() {
		return (
			<Query
				query={GET_CATEGORIES}
				pollInterval={1000 * 60 * 5}
				notifyOnNetworkStatusChange
				skip={window.location.hash !== '#/categories'}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
			>
				{({ loading, error, data }) => {
					if (error) return null
					if (loading) return <Loading size="large" />
					if (data && data.categories) {
						const categories = data.categories.map(x => ({ ...x, key: x.id }))
						return <TableView data={categories} />
					}
				}}
			</Query>
		)
	}
}

export default CategoriesTable

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
						name={record['name']}
						size="medium"
						src={cropCloudinayImage(record[field], 80, 80)}
					/>
				) : (
					<Avatar borderColor="transparent" isActive={false} isHover={false} size="small" />
				)
			case 'createdAt':
				return `${moment(record[field]).format('ddd, MMM Do YY')} `
			case 'countAddedJobs':
				return `${numeral(record[field]).format('0,0')}`
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
				title: 'Image',
				dataIndex: 'image',
				width: '10%'
			},
			{
				title: 'Name',
				dataIndex: 'name',
				...this.getColumnSearchProps('name')
			},
			{
				title: 'Action',
				dataIndex: 'operation',
				render: (text, record) => {
					return this.props.deleteCategoryLoading ? (
						<img alt="Category deleting..." src={InlineLoader} style={{ marginLeft: 12 }} />
					) : (
						<span>
							<Link style={{ marginLeft: 8, color: '#0D4EA6' }} to={`/category/${record.key}`}>
								View
							</Link>

							<Popconfirm
								title={`Sure to delete? This may contain products!`}
								icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
								onConfirm={() => this.props.deleteCategory({ variables: { id: record.key } })}
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
				rowClassName="category-table-row"
				title={() => (
					<Header>
						Total <span>{this.props.data.length}</span> Categor
						{this.props.data.length > 1 ? 'ies' : 'y'}
					</Header>
				)}
				pagination={{
					pageSize: 15,
					position: 'both',
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ['10', '15', '20', '30']
				}}
			/>
		)
	}
}
