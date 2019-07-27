import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Form, Input, Tooltip, Icon, Radio } from 'antd'
import { Grid, GridColumn } from '@atlaskit/page'
import Button from '@atlaskit/button'

import { notifyGraphQLError, notifySuccess, notifyInfo } from '../../../../utils/notify'
import { hasErrors } from '../../../../utils/helperFunctions'
import { GET_OVERVIEW } from '../overview'
import { GET_USERS } from './index'
import { AuthConsumer } from '../../../../context/authContext'
import { withNavigationViewController } from '@atlaskit/navigation-next'
import userRoutes from './userRoutes'

const ADD_A_USER = gql`
	mutation($data: signUpInput) {
		addUser(data: $data) {
			token
		}
	}
`

const formItemLayout = {
	labelCol: { span: 7 },
	wrapperCol: { span: 13 }
}
const formTailLayout = {
	labelCol: { span: 7 },
	wrapperCol: { span: 13, offset: 7 }
}
const inputStyle = { minWidth: '298px' }

class AddUser extends Component {
	componentDidMount() {
		const { navigationViewController } = this.props
		navigationViewController.setView(userRoutes.id)
		// To disabled add button at the beginning.
		this.props.form.validateFields()
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

		const fullNameError = isFieldTouched('fullName') && getFieldError('fullName')
		const userNameError = isFieldTouched('userName') && getFieldError('userName')
		const emailError = isFieldTouched('email') && getFieldError('email')
		const phoneError = isFieldTouched('phone') && getFieldError('phone')
		const passwordError = isFieldTouched('password') && getFieldError('password')
		const roleError = isFieldTouched('role') && getFieldError('role')
		const divisionError = isFieldTouched('division') && getFieldError('division')
		const regionError = isFieldTouched('region') && getFieldError('region')
		const addressError = isFieldTouched('address') && getFieldError('address')

		return (
			<>
				<AuthConsumer>
					{({ setUser, user }) => (
						<>
							<Mutation
								mutation={ADD_A_USER}
								onError={error => {
									const notice = notifyGraphQLError(error)
									if (notice && notice.logoutAction) {
										setTimeout(() => setUser(null), 3500)
									}
								}}
								/* To update the user amount */
								refetchQueries={() => [{ query: GET_OVERVIEW }, { query: GET_USERS }]}
								update={(cache, { data: { addUser } }) => {
									/* Just to notify the UI */
									if (addUser.token) {
										notifySuccess('New User Added Successfully!')
										this.props.form.resetFields()
										this.props.form.validateFields()
									}
								}}
							>
								{(addUser, { loading, data } /* Actual Form  */) => {
									return (
										<Grid spacing="comfortable">
											<GridColumn medium={2} />
											<GridColumn medium={8}>
												<Form
													layout="vertical"
													onSubmit={e => {
														e.preventDefault()
														this.props.form.validateFields(async (err, values) => {
															const strongRegex = new RegExp(
																'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
															)
															if (strongRegex.test(values.password)) {
																addUser({ variables: { data: { ...values } } })
															} else {
																notifyInfo(
																	'Passowrd minimum length is 8 including a Uppercase, a Lowercase, a Number and a Special character.'
																)
															}
														})
													}}
												>
													<Form.Item
														hasFeedback
														label="Full Name"
														validateStatus={fullNameError ? 'error' : ''}
														help={fullNameError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('full_name', {
															rules: [{ required: true, message: 'Provide Full Name!' }]
														})(<Input style={inputStyle} placeholder="Full Name" />)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="User Name"
														validateStatus={userNameError ? 'error' : ''}
														help={userNameError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('user_name', {
															rules: [{ required: true, message: 'Provide User Name!' }]
														})(<Input style={inputStyle} placeholder="User Name" />)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Email"
														validateStatus={emailError ? 'error' : ''}
														help={emailError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('email', {
															rules: [
																{
																	type: 'email',
																	message: `It's not a valid E-mail!`
																},
																{
																	required: true,
																	message: 'Please provide E-mail!'
																}
															]
														})(<Input style={inputStyle} placeholder="Email" />)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Phone(prefix +88)"
														validateStatus={phoneError ? 'error' : ''}
														help={phoneError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('phone', {
															rules: [
																{
																	required: true,
																	message: 'Provide phone number with country code!'
																}
															]
														})(
															<Input
																suffix={
																	<Tooltip title="Please prefix the phone number with the valid country code!">
																		<Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
																	</Tooltip>
																}
																style={inputStyle}
																placeholder="Phone number with country code"
															/>
														)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Password"
														validateStatus={passwordError ? 'error' : ''}
														help={passwordError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('password', {
															rules: [{ required: true, message: 'Provide Password!' }]
														})(
															<Input.Password
																prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
																style={inputStyle}
																placeholder="Password"
															/>
														)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Role"
														validateStatus={roleError ? 'error' : ''}
														help={roleError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('role', {
															rules: [{ required: true, message: 'Please select the user role.' }],
															initialValue: 'CONSUMER'
														})(
															<Radio.Group buttonStyle="solid">
																<Radio.Button value="ADMIN">ADMIN</Radio.Button>
																<Radio.Button value="PARTNER">PARTNER</Radio.Button>
																<Radio.Button value="CONSUMER">CONSUMER</Radio.Button>
															</Radio.Group>
														)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Division"
														validateStatus={divisionError ? 'error' : ''}
														help={divisionError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('division', {
															rules: [{ required: true, message: 'Provide Division!' }]
														})(<Input style={inputStyle} placeholder="Division (e.g. Barishal)" />)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Region"
														validateStatus={regionError ? 'error' : ''}
														help={regionError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('region', {
															rules: [{ required: true, message: 'Provide Region!' }]
														})(<Input style={inputStyle} placeholder="Region (e.g. Sodor)" />)}
													</Form.Item>
													<Form.Item
														hasFeedback
														label="Address"
														validateStatus={addressError ? 'error' : ''}
														help={addressError || ''}
														{...formItemLayout}
													>
														{getFieldDecorator('address', {
															rules: [{ required: true, message: 'Provide Address!' }]
														})(
															<Input style={inputStyle} placeholder="Address (e.g. C & B Road)" />
														)}
													</Form.Item>
													<Form.Item {...formTailLayout}>
														<Button
															type="submit"
															appearance="primary"
															isLoading={loading}
															isDisabled={hasErrors(getFieldsError())}
														>
															ADD USER
														</Button>
													</Form.Item>
												</Form>
											</GridColumn>
											<GridColumn medium={2} />
										</Grid>
									)
								}}
							</Mutation>
						</>
					)}
				</AuthConsumer>
			</>
		)
	}
}

export default withNavigationViewController(Form.create({ name: 'add_user_form' })(AddUser))
