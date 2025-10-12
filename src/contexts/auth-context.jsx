"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

// Test account credentials
const TEST_ACCOUNT = {
  email: "tima@gmail.com",
  password: "test123123",
  username: "NeArlan",
  name: "Arlan",
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("watchparty_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email, password) => {
    // Check against test account
    if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
      const userData = {
        email: TEST_ACCOUNT.email,
        username: TEST_ACCOUNT.username,
        name: TEST_ACCOUNT.name,
      }
      setUser(userData)
      localStorage.setItem("watchparty_user", JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: "Invalid credentials" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("watchparty_user")
  }

  const register = (email, password) => {
    // For now, just simulate registration
    const userData = {
      email,
      username: email.split("@")[0],
      name: email.split("@")[0],
    }
    setUser(userData)
    localStorage.setItem("watchparty_user", JSON.stringify(userData))
    return { success: true }
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
