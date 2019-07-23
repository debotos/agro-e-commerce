import React, { Component } from 'react'
import { Card } from 'antd'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Upload, Icon, Modal, Input } from 'antd'
import Button from '@atlaskit/button'

import { notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
import { Row, Column } from '../../../../components/Common'
import { GET_CATEGORIES } from './CategoriesTable'
import { GET_CATEGORY } from './ViewCategory'
import { getBase64 } from '../../../../utils/helperFunctions'

const UPDATE_CATEGORY = gql`
	mutation($id: ID!, $data: categoryUpdateInput) {
		updateCategory(id: $id, data: $data) {
			id
			name
			image
		}
	}
`

class UpdateCategory extends Component {
	state = {
		previewVisible: false,
		previewImage: '',
		fileList: [this.props.currentImage],
		name: this.props.data.name
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
		const { categoryId } = this.props
		return (
			<>
				<Mutation
					mutation={UPDATE_CATEGORY}
					/* To update UI */
					refetchQueries={() => [{ query: GET_CATEGORIES }]}
					update={(cache, { data: { updateCategory } }) => {
						const { category } = cache.readQuery({
							query: GET_CATEGORY,
							variables: { id: categoryId }
						})
						// console.log(updateCategory)
						cache.writeQuery({
							query: GET_CATEGORY,
							variables: { id: categoryId },
							data: { category: { ...category, ...updateCategory } }
						})
						notifySuccess(`'${updateCategory.name}' category updated successfully!`)
					}}
					onError={error => {
						const notice = notifyGraphQLError(error)
						if (notice && notice.logoutAction) {
							setTimeout(() => this.props.setUser(null), 3500)
						}
					}}
				>
					{(updateCategory, { loading, data }) => (
						<Card title="Update Category" bordered={true} style={{ marginBottom: '20px' }}>
							<Row style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
								<Column>
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
									</div>
								</Column>
								<Column>
									<Input
										placeholder="Category Name"
										allowClear={true}
										value={name}
										onChange={e => this.setState({ name: e.target.value })}
									/>
								</Column>
								<Column>
									<Button
										type="submit"
										appearance="primary"
										style={{ margin: '10px 0' }}
										isLoading={loading}
										isDisabled={!name || fileList.length === 0}
										onClick={() =>
											updateCategory({
												variables: {
													id: categoryId,
													data: {
														name,
														/* originFileObj will be null if user didn't select a new image */
														/* In result, current image will remain safe */
														image: fileList.length === 0 ? null : fileList[0].originFileObj
													}
												}
											})
										}
									>
										Update Category
									</Button>
								</Column>
							</Row>
						</Card>
					)}
				</Mutation>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</>
		)
	}
}

export default UpdateCategory
