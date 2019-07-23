import React from 'react'

/* user will hold { id, email, user_name, image, role } properties */
const AuthContext = React.createContext({ isAuthenticated: false, user: null, setUser: () => {} })

const AuthProvider = AuthContext.Provider
const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
