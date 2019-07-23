import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Avatar from '@atlaskit/avatar'
import { Input, Button, Table, Icon, Popconfirm } from 'antd'
import Highlighter from 'react-highlight-words'
import numeral from 'numeral'
import moment from 'moment'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import cropCloudinayImage from '../../../../utils/cropImage'
import InlineLoader from '../../../../assets/loader/inline-loader.gif'
import { notifyGraphQLError, notifySuccess, notifyError } from '../../../../utils/notify'
import Loading from '../../../../components/Loading'
import { GET_OVERVIEW } from '../overview'
import { GET_CATEGORY } from './ViewCategory'

const DELETE_PRODUCT = gql`
	mutation($id: ID!) {
		deleteProduct(id: $id) {
			id
			success
		}
	}
`

class ProductsTable extends Component {
	render() {
		const { categoryId, products } = this.props
		return (
			<Mutation
				mutation={DELETE_PRODUCT}
				/* To update the overview */
				refetchQueries={() => [{ query: GET_OVERVIEW }]}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
				update={(cache, { data: { deleteProduct } }) => {
					const { category } = cache.readQuery({
						query: GET_CATEGORY,
						variables: { id: categoryId }
					})

					if (deleteProduct.success) {
						cache.writeQuery({
							query: GET_CATEGORY,
							variables: { id: categoryId },
							data: {
								category: {
									...category,
									products: category.products.filter(x => x.id !== deleteProduct.id)
								}
							}
						})
						notifySuccess('Product deleted successfully!')
					} else {
						notifyError('Failed to delete the product.')
					}
				}}
			>
				{(deleteProduct, { loading, data }) => (
					<TableView data={products} deleteProduct={deleteProduct} deleteProductLoading={loading} />
				)}
			</Mutation>
		)
	}
}

export default ProductsTable

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
				title: 'Images' /* Todo */,
				dataIndex: 'image',
				width: '10%'
			},
			{
				title: 'Quantity',
				dataIndex: 'quantity',
				...this.getColumnSearchProps('quantity')
			},
			{
				title: 'Q.Ext.',
				dataIndex: 'quantity_extension',
				...this.getColumnSearchProps('quantity_extension')
			},
			{
				title: 'Price',
				dataIndex: 'price',
				sorter: (a, b) => a.price - b.price
			},
			{
				title: 'P.Ext.',
				dataIndex: 'price_extension',
				...this.getColumnSearchProps('price_extension')
			},
			{
				title: 'Retailable',
				dataIndex: 'retailable',
				width: '5%',
				filters: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
				onFilter: (value, record) => record.retailable.includes(value)
			},
			{
				title: 'Available',
				dataIndex: 'available_now',
				width: '5%',
				filters: [{ text: 'Yes', value: true }, { text: 'No', value: false }],
				onFilter: (value, record) => record.available_now.includes(value)
			},
			{
				title: 'Gov.Price',
				dataIndex: 'gov_price',
				sorter: (a, b) => a.gov_price - b.gov_price
			},
			{
				title: 'Gov.P.Ext.',
				dataIndex: 'gov_price_extension',
				...this.getColumnSearchProps('gov_price_extension')
			},
			{
				title: 'Owner',
				dataIndex: 'user',
				...this.getColumnSearchProps('user')
			},
			{
				title: 'Action',
				dataIndex: 'operation',
				render: (text, record) => {
					return this.props.deleteProductLoading ? (
						<img alt="Category deleting..." src={InlineLoader} style={{ marginLeft: 12 }} />
					) : (
						<span>
							<Link style={{ marginLeft: 8, color: '#0D4EA6' }} to={`/product/${record.key}`}>
								View
							</Link>

							<Popconfirm
								title={`Sure to delete? This may contain products!`}
								icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
								onConfirm={() => this.props.deleteProduct({ variables: { id: record.key } })}
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
						Total <span>{this.props.data.length}</span> job
						{this.props.data.length > 1 ? 's' : ''}
					</Header>
				)}
				pagination={{
					pageSize: 15,
					position: 'both',
					showSizeChanger: true,
					showQuickJumper: true,
					pageSizeOptions: ['10', '15', '20', '30', '45', '60', '100']
				}}
			/>
		)
	}
}
