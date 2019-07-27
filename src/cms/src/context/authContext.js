import React from 'react'

/* user will hold 
  { id, email, user_name, image, role,full_name,
  phone, address, region, division } properties 
*/
const AuthContext = React.createContext({ isAuthenticated: false, user: null, setUser: () => {} })

const AuthProvider = AuthContext.Provider
const AuthConsumer = AuthContext.Consumer

export { AuthProvider, AuthConsumer }
