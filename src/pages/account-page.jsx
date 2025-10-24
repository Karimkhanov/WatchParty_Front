"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { showToast } from "../components/toast"
import "./account-page.css"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function AccountPage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("public-profile")

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth")
    }
  }, [navigate, isAuthenticated, loading])

  if (loading) { return <div className="loading-container">Loading...</div> }
  if (!user) { return <div className="loading-container">Loading user data...</div> }

  return (
    <div className="page-container">
      <div className="account-layout">
        <aside className="account-sidebar">
          <button className={`sidebar-item ${activeSection === "public-profile" ? "active" : ""}`} onClick={() => setActiveSection("public-profile")}>Public Profile</button>
          <button className={`sidebar-item ${activeSection === "personal-info" ? "active" : ""}`} onClick={() => setActiveSection("personal-info")}>Personal Information</button>
          <button className={`sidebar-item ${activeSection === "security" ? "active" : ""}`} onClick={() => setActiveSection("security")}>Security</button>
          <button className={`sidebar-item ${activeSection === "billing" ? "active" : ""}`} onClick={() => setActiveSection("billing")}>Billing and Plans</button>
        </aside>
        <main className="account-content">
          {activeSection === "public-profile" && <PublicProfileSection user={user} updateUser={updateUser} />}
          {activeSection === "personal-info" && <PersonalInfoSection user={user} updateUser={updateUser} />}
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "billing" && <BillingSection />}
        </main>
      </div>
    </div>
  )
}

function PublicProfileSection({ user, updateUser }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({ name: user.name || "", username: user.username || "", bio: user.bio || "" })
  const [profilePicture, setProfilePicture] = useState(user.profile_picture || null)
  const fileInputRef = useRef(null)

  useEffect(() => { setProfilePicture(user.profile_picture || null) }, [user.profile_picture])

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })) }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("Please select an image file", "error"); return }
    if (file.size > 5 * 1024 * 1024) { showToast("File size must be less than 5MB", "error"); return }
    try {
      const uploadFormData = new FormData(); uploadFormData.append("profilePicture", file);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/upload-profile-picture`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: uploadFormData });
      const data = await response.json();
      if (data.success) {
        setProfilePicture(data.data.profile_picture); updateUser({ ...user, profile_picture: data.data.profile_picture });
        showToast("Profile picture updated successfully!", "success");
      } else { showToast(data.message || "Failed to upload profile picture", "error") }
    } catch (error) { console.error("Upload error:", error); showToast("Error uploading profile picture", "error") }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) { updateUser(data.data.user); setIsEditing(false); showToast("Profile updated successfully!", "success") } 
      else { showToast(data.message || "Failed to update profile", "error") }
    } catch (error) { console.error("Update error:", error); showToast("Error updating profile", "error") } 
    finally { setIsSaving(false) }
  }

  const handleCancel = () => { setFormData({ name: user.name || "", username: user.username || "", bio: user.bio || "" }); setIsEditing(false) }

  return ( <div className="section-content"><div className="profile-form-section"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}><h2 className="section-subtitle">Public Profile</h2>{!isEditing ? (<button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>) : (<div style={{ display: "flex", gap: "1rem" }}><button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>Cancel</button><button className="save-btn" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button></div>)}</div><div className="form-group"><label className="form-label">Name</label><input type="text" name="name" className="form-input" value={formData.name} onChange={handleInputChange} placeholder="Arlan" disabled={!isEditing} /><p className="form-hint">The name that will be displayed to other users</p></div><div className="form-group"><label className="form-label">Username</label><div className="username-input-wrapper"><span className="username-prefix">@</span><input type="text" name="username" className="form-input-with-prefix" value={formData.username} onChange={handleInputChange} placeholder="NeArlan" disabled={!isEditing} /></div><p className="form-hint">A unique name that other users can use to find you</p></div><div className="form-group"><label className="form-label">Bio</label><textarea name="bio" className="form-textarea" placeholder="Tell us a little about yourself" rows={6} value={formData.bio} onChange={handleInputChange} disabled={!isEditing}></textarea><p className="form-hint">Description of your profile</p></div></div><div className="profile-picture-section"><h3 className="section-subtitle">Profile Picture</h3><div className="profile-picture-wrapper"><div className="profile-picture-container"><img src={profilePicture ? `${API_URL}${profilePicture}` : "https://via.placeholder.com/200?text=No+Image"} alt="Profile" className="profile-picture"/></div><input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} /><button className="edit-picture-btn" onClick={() => fileInputRef.current?.click()}><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>Edit</button></div></div></div> )
}

function PersonalInfoSection({ user, updateUser }) {
  const [isEditing, setIsEditing] = useState(false); const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ email: user.email || "", phone_number: user.phone_number || "" });
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })) }
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (data.success) { updateUser(data.data.user); setIsEditing(false); showToast("Personal information updated successfully!", "success") } 
      else { showToast(data.message || "Failed to update information", "error") }
    } catch (error) { console.error("Update error:", error); showToast("Error updating information", "error") } 
    finally { setIsSaving(false) }
  }
  const handleCancel = () => { setFormData({ email: user.email || "", phone_number: user.phone_number || "" }); setIsEditing(false) }

  return ( <div className="section-content"><div className="personal-info-form"><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}><h2 className="section-subtitle">Personal Information</h2>{!isEditing ? (<button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Information</button>) : (<div style={{ display: "flex", gap: "1rem" }}><button className="cancel-btn" onClick={handleCancel} disabled={isSaving}>Cancel</button><button className="save-btn" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</button></div>)}</div><div className="form-group"><label className="form-label">Email</label><div className="input-with-badge"><input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} disabled={!isEditing} /><span className="verified-badge">Verified</span></div></div><div className="form-group"><label className="form-label">Phone Number</label><input type="tel" name="phone_number" className="form-input" placeholder="+77771234567" value={formData.phone_number} onChange={handleInputChange} disabled={!isEditing} /></div><div className="form-group"><label className="checkbox-label"><input type="checkbox" className="checkbox-input" /><span>I do not want to receive information about promotions and upcoming events</span></label></div></div><div className="promo-card"><h3 className="promo-title">Stay Connected</h3><p className="promo-text">Keep your contact information up to date</p><div style={{ fontSize: "4rem", marginTop: "1rem" }}>📱</div></div></div> )
}

function SecuritySection() { return <div>Security Section Content</div> }
function BillingSection() { return <div>Billing Section Content</div> }