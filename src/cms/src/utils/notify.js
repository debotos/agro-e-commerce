import { notification } from 'antd'

import apolloClient from '../config/apolloClient'

export const notifyGraphQLError = (err, title) => {
	const { graphQLErrors, networkError } = err

	if (graphQLErrors) {
		for (let err of graphQLErrors) {
			const {
				extensions: { code },
				message
			} = err

			if (code === 'BAD_USER_INPUT') {
				notification.warning({
					message: title ? title : 'INVALID INPUT',
					description: message
				})
				return
			}

			if (code === 'INTERNAL_SERVER_ERROR') {
				notification.warning({
					message: title ? title : 'ERROR',
					description: message
				})

				return
			}

			if (code === 'UNAUTHENTICATED') {
				notification.error({
					message: title ? title : 'SESSION TIMEOUT',
					description: `${message} ${title ? '' : 'Please login again.'}`
				})

				apolloClient.resetStore()
				return { logoutAction: true }
			}
		}
	}

	if (networkError) {
		if (networkError.name === 'ServerParseError') {
			notification.error({
				message: `SERVER UNDER MAINTENANCE`,
				description: `The server is under maintenance. Please try again later.`
			})
		}
	}
}

export const notifyError = (msg, title) => {
	notification.error({
		message: title ? title : 'ACTION FAILED',
		description: msg
	})
}

export const notifySuccess = msg => {
	notification.success({
		message: `ACTION SUCCESSFUL`,
		description: msg
	})
}
