import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
// import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
/* For now, I will try to use ContextAPI or Redux instead of 'apollo-link-state' */
// import { withClientState } from 'apollo-link-state'
import { createUploadLink } from 'apollo-upload-client'

const GRAPHQL_API = '/graphql'

const cache = new InMemoryCache()

const handleUnauthenticated = () => {
	// remove the expired 'AUTH_TOKEN' form localStorage if have
	localStorage.removeItem('AUTH_TOKEN')
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
	if (graphQLErrors) {
		for (let err of graphQLErrors) {
			console.log(`[GraphQL Error] code:${err.extensions.code} msg:${err.message}`)
			switch (err.extensions.code) {
				case 'UNAUTHENTICATED':
					handleUnauthenticated()
					break
				case 'BAD_USER_INPUT':
					break
				default:
					console.log('No action taken!')
			}
		}
	}
	if (networkError) {
		if (networkError.name === 'ServerParseError') {
			console.log('\n====================Error==========================')
			console.log('Unable to connect to the Server. Server may be down.')
			console.log('====================Error==========================\n')
		} else {
			for (let err of networkError.result.errors) {
				const { message, extensions } = err
				console.log(`[Network Error] code:${extensions.code} msg:${message}`)
				switch (extensions.code) {
					case 'UNAUTHENTICATED':
						handleUnauthenticated()
						break
					default:
						console.log('No action taken!')
				}
			}
		}
	}
})

const authLink = setContext((_, { headers }) => {
	const context = {
		headers: {
			...headers,
			'x-token': localStorage.getItem('AUTH_TOKEN') || ''
		}
	}
	return context
})

/*
  Apollo Client can only have 1 “terminating” Apollo Link that sends the GraphQL requests;
  if one such as apollo-link-http is already setup, remove it.

  Initialize the client with a terminating link using createUploadLink
*/

// const httpLink = new HttpLink({ uri: GRAPHQL_API })

const httpLinkWithUpload = createUploadLink({ uri: GRAPHQL_API })

const client = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, httpLinkWithUpload]),
	cache
})

export default client
