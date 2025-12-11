"use client"

import { createContext, useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser, setLoading, setError, logout as logoutAction } from "../store/slices/authSlice"
import { authService } from "../services/authService"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebase"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  // Берем данные из Redux Store
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth)

  // Инициализация Firebase слушателя
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Если пользователь залогинен в Firebase, получаем данные профиля с бэкенда
          const currentUser = await authService.getCurrentUser() 
          if (currentUser) {
             dispatch(setUser(currentUser))
          }
        } else {
          dispatch(setUser(null))
        }
      } catch (error) {
        console.error("Auth init error:", error)
        dispatch(setUser(null))
      } finally {
        dispatch(setLoading(false))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  const signup = async (email, password, username, displayName) => {
    dispatch(setLoading(true))
    const result = await authService.signup(email, password, username, displayName)
    if (result.success) {
      dispatch(setUser(result.user))
    } else {
      dispatch(setError(result.message || "Signup failed"))
    }
    dispatch(setLoading(false))
    return result
  }

  const login = async (email, password) => {
    dispatch(setLoading(true))
    const result = await authService.login(email, password)
    if (result.success) {
      dispatch(setUser(result.user))
    } else {
      dispatch(setError(result.message || "Login failed"))
    }
    dispatch(setLoading(false))
    return result
  }

  const logoutUser = async () => {
    const result = await authService.logout()
    if (result.success) {
      dispatch(logoutAction())
    }
    return result
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signup,
        login,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}