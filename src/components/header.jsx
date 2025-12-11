"use client"

import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext" 
import { useTheme } from "../contexts/theme-context"
import { useSelector } from "react-redux"
import "./header.css"

function Header() {
  const { logout } = useAuth() 
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)

  const handleLogout = async () => {
    await logout()
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
          <Link to="/movies" className="nav-link">
            Movies
          </Link>
          <Link to="/rooms" className="nav-link">
            Rooms
          </Link>
          {user && (
            <Link to="/favorites" className="nav-link">
              Favorites
            </Link>
          )}
          <Link to="/about" className="nav-link">
            About Us
          </Link>
        </nav>

        <div className="header-actions">
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
            <>
              <Link to="/profile" className="user-link">
                <div className="user-avatar">
                  {user.profilePicture ? (
                    <img src={user.profilePicture || "/placeholder.svg"} alt={user.displayName || user.username} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Sign In
              </Link>
              <Link to="/signup" className="btn-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header