"use client"

// src/pages/auth-page.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import "./auth-page.css"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("register")
  const [registrationStep, setRegistrationStep] = useState(1) // 1 = email/password, 2 = username
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "", username: "", name: "", passwordAgain: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const navigate = useNavigate()
  const { login, register } = useAuth()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContinueRegistration = (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.passwordAgain) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setRegistrationStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (activeTab === "login") {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          navigate("/")
        } else {
          setError(result.message || "Login failed")
        }
      } else {
        if (!formData.username.trim()) {
          throw new Error("Username is required")
        }
        const result = await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          name: formData.name || formData.username,
        })
        if (result.success) {
          navigate("/rooms")
        } else {
          setError(result.message || "Registration failed")
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(data.message)
        setTimeout(() => {
          setShowForgotPassword(false)
          setSuccessMessage("")
          setActiveTab("login")
        }, 3000)
      } else {
        setError(data.message || "Failed to send reset email")
      }
    } catch (err) {
      setError("Failed to send reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setRegistrationStep(1)
    setShowForgotPassword(false)
    setError("")
    setSuccessMessage("")
  }

  const handleBackToStep1 = () => {
    setRegistrationStep(1)
    setError("")
  }

  return (
    <div className="auth-container">
      <div className="form-card">
        {!showForgotPassword && (
          <div className="tabs">
            <button
              className={`tab ${activeTab === "register" ? "active" : ""}`}
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
            <button className={`tab ${activeTab === "login" ? "active" : ""}`} onClick={() => handleTabChange("login")}>
              Login
            </button>
          </div>
        )}

        {showForgotPassword ? (
          <form className="form" onSubmit={handleForgotPassword}>
            <div className="form-header">
              <h2 className="form-title">Reset Password</h2>
              <p className="form-subtitle">Enter your email to receive a password reset link</p>
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                required
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              className="back-link"
              onClick={() => {
                setShowForgotPassword(false)
                setError("")
                setSuccessMessage("")
              }}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form
            className="form"
            onSubmit={activeTab === "register" && registrationStep === 1 ? handleContinueRegistration : handleSubmit}
          >
            {activeTab === "register" && registrationStep === 1 && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password Again</label>
                  <input
                    type="password"
                    name="passwordAgain"
                    className="form-input"
                    required
                    value={formData.passwordAgain}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">
                  Continue
                </button>
              </>
            )}

            {activeTab === "register" && registrationStep === 2 && (
              <>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    className="form-input"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    autoComplete="username"
                  />
                  <p className="helper-text">Create a unique name for your account so that other users can find you</p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <button type="button" className="back-link" onClick={handleBackToStep1}>
                  Back
                </button>
              </>
            )}

            {activeTab === "login" && (
              <>
                <div className="form-group">
                  <label className="form-label">Username or Email</label>
                  <input
                    type="text"
                    name="email"
                    className="form-input"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    autoComplete="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    autoComplete="current-password"
                  />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {
                    setShowForgotPassword(true)
                    setError("")
                  }}
                >
                  Forget your password?
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
