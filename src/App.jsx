"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "./contexts/auth-context"
import { ToastProvider } from "./components/toast"
import HomePage from "./pages/home-page"
import RoomsPage from "./pages/rooms-page"
import AboutPage from "./pages/about-page"
import AuthPage from "./pages/auth-page"
import AccountPage from "./pages/account-page"
import "./App.css"

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  // Simple client-side routing
  const navigate = (page) => {
    console.log("[v0] Navigating to:", page)
    setCurrentPage(page)
    window.history.pushState({}, "", `/${page === "home" ? "" : page}`)
  }

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || "home"
      setCurrentPage(path)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.tagName === "A" && e.target.href.startsWith(window.location.origin)) {
        e.preventDefault()
        const path = e.target.pathname.slice(1) || "home"
        navigate(path)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const renderPage = () => {
    console.log("[v0] Current page:", currentPage)
    switch (currentPage) {
      case "home":
        return <HomePage navigate={navigate} />
      case "rooms":
        return <RoomsPage navigate={navigate} />
      case "about":
        return <AboutPage navigate={navigate} />
      case "auth":
        return <AuthPage navigate={navigate} />
      case "account":
        return <AccountPage navigate={navigate} />
      default:
        return <HomePage navigate={navigate} />
    }
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="app">{renderPage()}</div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
