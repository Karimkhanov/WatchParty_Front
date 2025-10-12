"use client"

import { useAuth } from "../contexts/auth-context"
import "./header.css"

export default function Header({ currentPage = "home", navigate }) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("home")
  }

  return (
    <header className="header">
      <div className="logo">WatchParty</div>
      <nav className="nav">
        <a href="/" className={`nav-link ${currentPage === "home" ? "active" : ""}`}>
          Home
        </a>
        <a href="/rooms" className={`nav-link ${currentPage === "rooms" ? "active" : ""}`}>
          Rooms
        </a>
        <a href="/about" className={`nav-link ${currentPage === "about" ? "active" : ""}`}>
          About Us
        </a>
      </nav>
      <div className="header-actions">
        {user ? (
          <>
            <button
              className="account-btn"
              onClick={() => navigate("account")}
              aria-label="Account settings"
              title="Account"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button className="create-room-btn" aria-label="Create room" title="Create Room">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="sign-out-btn" onClick={handleLogout}>
              Sign Out
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : (
          <a href="/auth" className="sign-in-btn">
            Sign In
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
        <div className="theme-toggle">
          <button className="theme-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="4" />
              <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364" />
            </svg>
          </button>
          <button className="theme-btn active">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
