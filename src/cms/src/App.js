import React, { Component } from 'react'
import { ApolloProvider } from 'react-apollo'
import jwt_decode from 'jwt-decode'
import { AtlaskitThemeProvider } from '@atlaskit/theme'

import { AuthProvider } from './context/authContext'
import isEmpty from './utils/isEmpty'
import AppRoutes from './AppRoutes'
import apolloClient from './config/apolloClient'

class App extends Component {
	componentDidMount() {
		/*  Check for 'AUTH_TOKEN' at very first */
		if (localStorage.AUTH_TOKEN) {
			// Decode token and get user info and exp
			const user = jwt_decode(localStorage.AUTH_TOKEN)
			// Check for expired token
			const currentTime = Date.now() / 1000
			if (user.exp < currentTime || user.role !== 'ADMIN') {
				/* Token is invalid */
				// So, Remove from localStorage
				localStorage.removeItem('AUTH_TOKEN')
			} else {
				/* Token is still valid */
				// So, Set the user info to UserContext
				this.setState({ user, isAuthenticated: !isEmpty(user) })
			}
		}
	}

	constructor(props) {
		super(props)
		/* Don't change this state. It's purely for auth management */
		this.state = {
			isAuthenticated: false,
			user: null,
			setUser: user => this.setState({ user, isAuthenticated: !isEmpty(user) })
		}
	}

	render() {
		return (
			<AuthProvider value={this.state}>
				<ApolloProvider client={apolloClient}>
					<AtlaskitThemeProvider mode="light">
						<AppRoutes />
					</AtlaskitThemeProvider>
				</ApolloProvider>
			</AuthProvider>
		)
	}
}

export default App
