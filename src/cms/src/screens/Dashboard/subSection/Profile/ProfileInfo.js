import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Form, Input, Icon, Tooltip } from 'antd'
import Button from '@atlaskit/button'

import { notifyGraphQLError, notifySuccess } from '../../../../utils/notify'
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

const CHANGE_PROFILE_INFO = gql`
	mutation($data: updateProfileInput) {
		updateProfile(data: $data) {
			user {
				full_name
				phone
				division
				region
				address
			}
			token
		}
	}
`
class ProfileInfo extends Component {
	componentDidMount() {
		// To disabled add button at the beginning.
		this.props.form.validateFields()
	}
	render() {
		const { setUser, user } = this.props
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form

		const nameError = isFieldTouched('name') && getFieldError('name')
		const phoneError = isFieldTouched('phone') && getFieldError('phone')
		const divisionError = isFieldTouched('division') && getFieldError('division')
		const regionError = isFieldTouched('region') && getFieldError('region')
		const addressError = isFieldTouched('address') && getFieldError('address')
		return (
			<Mutation
				mutation={CHANGE_PROFILE_INFO}
				onError={error => {
					const notice = notifyGraphQLError(error)
					if (notice && notice.logoutAction) {
						setTimeout(() => this.props.setUser(null), 3500)
					}
				}}
				update={(cache, { data: { updateProfile } }) => {
					console.log(updateProfile)
					/* Just Update the UI */
					setUser({ ...user, ...updateProfile.user })
					localStorage.setItem('AUTH_TOKEN', updateProfile.token)
					notifySuccess('Profile info updated!')
				}}
			>
				{(updateProfile, { loading, data }) => {
					return (
						<>
							<Form
								layout="vertical"
								onSubmit={e => {
									e.preventDefault()
									this.props.form.validateFields(async (err, values) => {
										const phone = values.phone
										if (!phone.includes('+88')) {
											values.phone = `+88${phone}`
										}
										values.full_name = values.name
										delete values.name
										updateProfile({
											variables: {
												data: { ...values }
											}
										})
									})
								}}
							>
								<Form.Item
									label="Full Name"
									validateStatus={nameError ? 'error' : ''}
									help={nameError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('name', {
										rules: [{ required: true, message: 'Provide Full Name!' }],
										initialValue: user.full_name
									})(<Input style={inputStyle} placeholder="Full Name" />)}
								</Form.Item>
								<Form.Item
									label="Phone(prefix +88)"
									validateStatus={phoneError ? 'error' : ''}
									help={phoneError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('phone', {
										rules: [{ required: true, message: 'Provide phone number with country code!' }],
										initialValue: user.phone
									})(
										<Input
											suffix={
												<Tooltip title="Please prefix the phone number with your country code!">
													<Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
												</Tooltip>
											}
											style={inputStyle}
											placeholder="Phone number with country code"
										/>
									)}
								</Form.Item>
								<Form.Item
									label="Division"
									validateStatus={divisionError ? 'error' : ''}
									help={divisionError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('division', {
										rules: [{ required: true, message: 'Provide Division!' }],
										initialValue: user.division
									})(<Input style={inputStyle} placeholder="Division (e.g. Barishal)" />)}
								</Form.Item>
								<Form.Item
									label="Region"
									validateStatus={regionError ? 'error' : ''}
									help={regionError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('region', {
										rules: [{ required: true, message: 'Provide Region!' }],
										initialValue: user.region
									})(<Input style={inputStyle} placeholder="Region (e.g. Sodor)" />)}
								</Form.Item>
								<Form.Item
									label="Address"
									validateStatus={addressError ? 'error' : ''}
									help={addressError || ''}
									{...formItemLayout}
								>
									{getFieldDecorator('address', {
										rules: [{ required: true, message: 'Provide Address!' }],
										initialValue: user.address
									})(<Input style={inputStyle} placeholder="Address (e.g. C & B Road)" />)}
								</Form.Item>
								<Form.Item {...formTailLayout}>
									<Button
										type="submit"
										appearance="primary"
										isLoading={loading}
										isDisabled={hasErrors(getFieldsError())}
									>
										Update
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

export default Form.create({ name: 'profile_update_form' })(ProfileInfo)
