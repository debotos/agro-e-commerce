import React, { Fragment } from 'react'
import TextField from '@atlaskit/textfield'
import Button, { ButtonGroup } from '@atlaskit/button'
import Form, { Field, FormFooter, ErrorMessage } from '@atlaskit/form'
import styled from 'styled-components'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import jwt_decode from 'jwt-decode'

import { notifyGraphQLError, notifyError } from '../utils/notify'
import { AuthConsumer } from '../context/authContext'

const Center = styled.div`
	height: 100vh;
	width: 100vw;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Container = styled.div`
	display: flex;
	width: 400px;
	max-width: 100%;
	margin: 0 auto;
	flex-direction: column;
`

const LOGIN = gql`
	mutation($login: String!, $password: String!) {
		signIn(login: $login, password: $password) {
			token
		}
	}
`

export default () => {
	return (
		<>
			<Center>
				<Container>
					<AuthConsumer>
						{({ setUser }) => (
							<Mutation
								mutation={LOGIN}
								onError={error => notifyGraphQLError(error, 'INVALID INPUT')}
							>
								{(mutate, { data, loading }) => {
									if (data) {
										// Check ADMIN or not
										const user = jwt_decode(data.signIn.token)
										if (user.role === 'ADMIN') {
											// Store token to localStorage
											localStorage.setItem('AUTH_TOKEN', data.signIn.token)
											// Update the auth context
											setUser(user)
										} else {
											notifyError(
												'You are not an admin user. So, your account will be banned if you attempt to do this type of malicious act.',
												'MALICIOUS ATTEMPT'
											)
										}
									}

									return (
										<Form
											onSubmit={data => {
												const { login, password } = data
												mutate({ variables: { login, password } })
											}}
										>
											{({ formProps, submitting }) => (
												<form {...formProps}>
													<Field name="login" label="User name or Email" isRequired defaultValue="">
														{({ fieldProps, error }) => (
															<Fragment>
																<TextField
																	autoComplete="off"
																	{...fieldProps}
																	css={{ height: 40 }}
																/>
															</Fragment>
														)}
													</Field>
													<Field
														name="password"
														label="Password"
														defaultValue=""
														isRequired
														validate={value => (value.length < 1 ? 'TOO_SHORT' : undefined)}
													>
														{({ fieldProps, error, valid }) => (
															<Fragment>
																<TextField type="password" {...fieldProps} css={{ height: 40 }} />
																{error && <ErrorMessage>Password input is not valid.</ErrorMessage>}
															</Fragment>
														)}
													</Field>

													<FormFooter>
														<ButtonGroup>
															<Button type="submit" appearance="primary" isLoading={loading}>
																Sign in
															</Button>
														</ButtonGroup>
													</FormFooter>
												</form>
											)}
										</Form>
									)
								}}
							</Mutation>
						)}
					</AuthConsumer>
				</Container>
			</Center>
		</>
	)
}
