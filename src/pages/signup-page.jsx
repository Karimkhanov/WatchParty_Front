"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext" 
import "./auth-page.css"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    username: "",
    displayName: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { signup } = useAuth() 

  const validatePassword = (password) => {
    const errors = {}
    if (password.length < 8) {
      errors.length = "At least 8 characters"
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = "One uppercase letter"
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = "One lowercase letter"
    }
    if (!/\d/.test(password)) {
      errors.number = "One number"
    }
    if (!/[!@#$%^&*()_+\-=[\]{};:'",.<>?]/.test(password)) {
      errors.special = "One special character"
    }
    return errors
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is not valid"
    }

    const passwordErrors = validatePassword(formData.password)
    if (Object.keys(passwordErrors).length > 0) {
      newErrors.passwordErrors = passwordErrors
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      setErrors({})
      setStep(2)
    }
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const result = await signup(formData.email, formData.password, formData.username, formData.displayName)
      if (result.success) {
        navigate("/")
      } else {
        setErrors({ submit: result.message || "Signup failed" })
      }
    } catch (err) {
      setErrors({ submit: err.message || "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2 className="form-title">Create Account</h2>

        {step === 1 ? (
          <form className="form" onSubmit={handleStep1Submit}>
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
              {errors.email && <p className="error-message">{errors.email}</p>}
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
              {errors.passwordErrors && (
                <div className="error-list">
                  {Object.entries(errors.passwordErrors).map(([key, msg]) => (
                    <p key={key} className="error-message">
                      {msg}
                    </p>
                  ))}
                </div>
              )}
              <p className="helper-text">
                Password must have: 8+ chars, uppercase, lowercase, number, special character
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="passwordConfirm"
                className="form-input"
                required
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                autoComplete="new-password"
              />
              {errors.passwordConfirm && <p className="error-message">{errors.passwordConfirm}</p>}
            </div>

            <button type="submit" className="submit-btn">
              Continue
            </button>

            <p className="auth-link">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        ) : (
          <form className="form" onSubmit={handleStep2Submit}>
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
              <p className="helper-text">This is how other users will see you</p>
            </div>

            <div className="form-group">
              <label className="form-label">Display Name (Optional)</label>
              <input
                type="text"
                name="displayName"
                className="form-input"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </div>

            {errors.submit && <p className="error-message">{errors.submit}</p>}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <button
              type="button"
              className="back-link"
              onClick={() => {
                setStep(1)
                setErrors({})
              }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}