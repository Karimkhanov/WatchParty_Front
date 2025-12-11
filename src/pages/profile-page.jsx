"use client"

import { useState, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setUser } from "../store/slices/authSlice"
import { profileService } from "../services/profileService"
import "./profile-page.css"

export default function ProfilePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const fileInputRef = useRef(null)

  if (!user) {
    return (
      <div className="profile-main">
        <p>Please log in to view your profile.</p>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    )
  }

  const handlePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handlePictureUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Compress image
      const compressed = await profileService.compressImage(file)

      // Convert to base64
      const base64 = await profileService.imageToBase64(compressed)

      // Update profile with base64 image
      const result = await profileService.updateProfile(user.uid, {
        profilePicture: base64,
      })

      if (result.success) {
        // Update Redux with new profile picture
        dispatch(
          setUser({
            ...user,
            profilePicture: base64,
          }),
        )
        setSuccess("Profile picture updated successfully!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError("Failed to update profile picture")
      }
    } catch (err) {
      setError("Error uploading image. Please try again.")
      console.error(err)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDisplayNameUpdate = async () => {
    if (!displayName.trim()) {
      setError("Display name cannot be empty")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await profileService.updateProfile(user.uid, {
        displayName: displayName.trim(),
      })

      if (result.success) {
        dispatch(
          setUser({
            ...user,
            displayName: displayName.trim(),
          }),
        )
        setSuccess("Display name updated successfully!")
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError("Failed to update display name")
      }
    } catch (err) {
      setError("Error updating profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-main">
      <div className="profile-container">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="picture-frame">
            {user.profilePicture ? (
              <img src={user.profilePicture || "/placeholder.svg"} alt="Profile" className="profile-picture" />
            ) : (
              <div className="default-avatar">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </div>
          <button onClick={handlePictureClick} disabled={uploading} className="upload-picture-btn">
            {uploading ? "Uploading..." : "Change Picture"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePictureUpload}
            style={{ display: "none" }}
          />
        </div>

        {/* User Info Section */}
        <div className="profile-info-section">
          <div className="info-group">
            <label>Email</label>
            <p className="info-value">{user.email}</p>
          </div>

          <div className="info-group">
            <label>Username</label>
            <p className="info-value">{user.username}</p>
          </div>

          <div className="info-group">
            <label>Display Name</label>
            <div className="edit-group">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="profile-input"
              />
              <button
                onClick={handleDisplayNameUpdate}
                disabled={loading || displayName === user.displayName}
                className="update-btn"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="profile-additional">
          <div className="info-card">
            <h3>Account Created</h3>
            <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Information not available"}</p>
          </div>
          <div className="info-card">
            <h3>Last Updated</h3>
            <p>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "Information not available"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
