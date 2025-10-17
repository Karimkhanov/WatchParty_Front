"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { useTheme } from "../contexts/theme-context"
import "./header.css"

function Header() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          WatchParty
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {user && (
            <Link to="/account" className="nav-link">
              Account
            </Link>
          )}
          <Link to="/rooms" className="nav-link">
            Rooms
          </Link>
          <Link to="/about" className="nav-link">
            About Us
          </Link>
        </nav>

        <div className="header-actions">
          {user && (
            <button className="btn-create-room-header" onClick={() => navigate("/rooms")} title="Create Room">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
          )}

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "dark" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {user ? (
            <button onClick={handleLogout} className="btn-logout">
              Sign Out
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ marginLeft: "0.5rem", display: "inline" }}
              >
                <path d="M6 14L12 8L6 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </button>
          ) : (
            <Link to="/auth" className="btn-login">
              Sign In
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ marginLeft: "0.5rem", display: "inline" }}
              >
                <path d="M6 14L12 8L6 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
