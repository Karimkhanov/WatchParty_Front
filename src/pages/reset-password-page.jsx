import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./reset-password-page.css"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/auth")
        }, 2000)
      } else {
        setError(data.message || "Failed to reset password")
      }
    } catch (err) {
      console.error("Reset password error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="reset-container">
      <div className="form-card">
        <div className="form-header">
          <h1 className="form-title">Reset Password</h1>
          <p className="form-subtitle">Enter your new password below</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter new password"
              disabled={loading || success}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Confirm new password"
              disabled={loading || success}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || success}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="form-footer">
            <a href="/auth" className="back-link">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
