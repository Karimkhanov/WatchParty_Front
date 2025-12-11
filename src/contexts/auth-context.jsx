// "use client"

// import { createContext, useContext, useState, useEffect } from "react"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)

//   useEffect(() => {
//     checkAuth()
//   }, [])

//   const checkAuth = async () => {
//     const token = localStorage.getItem("token")
//     if (!token) {
//       setLoading(false)
//       return
//     }

//     try {
//       const response = await fetch(`${API_URL}/api/auth/profile`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setUser(data.data.user)
//         setIsAuthenticated(true)
//       } else {
//         localStorage.removeItem("token")
//         setUser(null)
//         setIsAuthenticated(false)
//       }
//     } catch (error) {
//       console.error("Auth check failed:", error)
//       localStorage.removeItem("token")
//       setUser(null)
//       setIsAuthenticated(false)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${API_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         localStorage.setItem("token", data.data.token)
//         setUser(data.data.user)
//         setIsAuthenticated(true)
//         return { success: true }
//       } else {
//         return { success: false, message: data.message }
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       return { success: false, message: "Network error" }
//     }
//   }

//   const register = async (email, username, password, name) => {
//     try {
//       const response = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, username, password, name }),
//       })

//       const data = await response.json()

//       if (data.success) {
//         localStorage.setItem("token", data.data.token)
//         setUser(data.data.user)
//         setIsAuthenticated(true)
//         return { success: true }
//       } else {
//         return { success: false, message: data.message }
//       }
//     } catch (error) {
//       console.error("Register error:", error)
//       return { success: false, message: "Network error" }
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("token")
//     setUser(null)
//     setIsAuthenticated(false)
//   }

//   const updateUser = (updatedUser) => {
//     setUser(updatedUser)
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout, updateUser }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }
