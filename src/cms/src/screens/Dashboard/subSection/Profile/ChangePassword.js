import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Form, Input, Icon } from 'antd'
import Button from '@atlaskit/button'

import { notifyGraphQLError, notifySuccess, notifyInfo } from '../../../../utils/notify'
import { hasErrors } from '../../../../utils/helperFunctions'

const formItemLayout = {
	labelCol: { span: 7 },
	wrapperCol: { span: 10 }
}
const formTailLayout = {
	labelCol: { span: 7 },
	wrapperCol: { span: 10, offset: 7 }
}
const inputStyle = { minWidth: '298px' }

const CHANGE_PASSWORD = gql`
	mutation($current: String!, $new: String!) {
		changePassword(currentPassword: $current, newPassword: $new) {
			token
		}
	}
`
class ChangePassword extends Component {
	componentDidMount() {
		// To disabled add button at the beginning.
		this.props.form.validateFields()
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

		const currentError = isFieldTouched('current') && getFieldError('current')
		const newError = isFieldTouched('new') && getFieldError('new')

		return (
			<Mutation
				mutation={CHANGE_PASSWORD}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
				update={(cache, { data: { changePassword } }) => {
					localStorage.setItem('AUTH_TOKEN', changePassword.token)
					notifySuccess('Your account password updated!')
				}}
			>
				{(changePassword, { loading, data }) => {
					return (
						<>
							<Form
								layout="vertical"
								onSubmit={e => {
									e.preventDefault()
									this.props.form.validateFields(async (err, values) => {
										const strongRegex = new RegExp(
											'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
										)
										if (strongRegex.test(values.new)) {
											changePassword({ variables: { ...values } })
											this.props.form.resetFields()
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
									label="Current Password"
									validateStatus={currentError ? 'error' : ''}
									help={currentError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('current', {
										rules: [{ required: true, message: 'Provide Current Password!' }]
									})(
										<Input.Password
											prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
											style={inputStyle}
											placeholder="Current Password"
										/>
									)}
								</Form.Item>
								<Form.Item
									hasFeedback
									label="New Password"
									validateStatus={newError ? 'error' : ''}
									help={newError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('new', {
										rules: [{ required: true, message: 'Provide New Password!' }]
									})(
										<Input.Password
											prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
											style={inputStyle}
											placeholder="New Password"
										/>
									)}
								</Form.Item>

								<Form.Item {...formTailLayout}>
									<Button
										type="submit"
										appearance="primary"
										isLoading={loading}
										isDisabled={hasErrors(getFieldsError())}
									>
										Change Password
									</Button>
								</Form.Item>
							</Form>
						</>
					)
				}}
			</Mutation>
		)
	}
}

export default Form.create({ name: 'change_password_form' })(ChangePassword)
