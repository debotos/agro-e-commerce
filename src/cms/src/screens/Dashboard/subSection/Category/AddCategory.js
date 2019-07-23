import React, { Component } from 'react'
import { Card } from 'antd'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { Upload, Icon, Modal, Input } from 'antd'
import Button from '@atlaskit/button'

import { notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
import { GET_CATEGORIES } from './CategoriesTable'

const ADD_CATEGORY = gql`
	mutation($data: categoryAddInput) {
		addCategory(data: $data) {
			id
			name
			image
		}
	}
`
const initialState = { previewVisible: false, previewImage: '', fileList: [], name: '' }

class AddCategory extends Component {
	state = {
		...initialState
	}

	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = async file => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj)
		}

		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true
		})
	}

	handleChange = ({ fileList }) => {
		// console.log(fileList)
		this.setState({ fileList })
	}

	render() {
		const { previewVisible, previewImage, name, fileList } = this.state
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		)
		return (
			<Mutation
				mutation={ADD_CATEGORY}
				update={(cache, { data: { addCategory } }) => {
					const { categories } = cache.readQuery({ query: GET_CATEGORIES })
					console.log(addCategory)
					cache.writeQuery({
						query: GET_CATEGORIES,
						data: { categories: [addCategory, ...categories] }
					})
					notifySuccess(`'${addCategory.name}' category added successfully!`)
					this.setState(initialState)
				}}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
			>
				{(addCategory, { loading, data }) => (
					<Card title="Add Category" bordered={true}>
						<h5 style={{ marginBottom: '5px' }}>Choose an image(200 x 200 Recommended)</h5>
						<div className="clearfix category-image-upload">
							<Upload
								accept="image/png, image/jpeg, image/jpg"
								listType="picture-card"
								fileList={fileList}
								onPreview={this.handlePreview}
								onChange={this.handleChange}
								beforeUpload={(file, fileList) => {
									// console.log(file, fileList)
									return false /* To stop the default upload behaviour */
								}}
							>
								{fileList.length >= 1 ? null : uploadButton}
							</Upload>
							<Input
								placeholder="Category Name"
								allowClear={true}
								value={name}
								onChange={e => this.setState({ name: e.target.value })}
							/>
							<Button
								type="submit"
								appearance="primary"
								style={{ margin: '10px 0' }}
								isLoading={loading}
								isDisabled={!name || fileList.length === 0}
								onClick={() =>
									addCategory({
										variables: { data: { name, image: fileList[0].originFileObj } }
									})
								}
							>
								Update
							</Button>
							<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
								<img alt="example" style={{ width: '100%' }} src={previewImage} />
							</Modal>
						</div>
					</Card>
				)}
			</Mutation>
		)
	}
}

export default AddCategory

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => resolve(reader.result)
		reader.onerror = error => reject(error)
	})
}
