import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Default admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@shopease.com',
  password: 'admin123'
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true'
  })
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('adminUser')
    return savedAdmin ? JSON.parse(savedAdmin) : null
  })

  const login = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true)
      setAdmin({ email, name: 'Admin' })
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUser', JSON.stringify({ email, name: 'Admin' }))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setAdmin(null)
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
  }

  const value = {
    isAuthenticated,
    admin,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
