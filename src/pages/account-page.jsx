"use client"

import { useState } from "react"
import { useAuth } from "../contexts/auth-context"
import Header from "../components/header"
import "./account-page.css"

export default function AccountPage({ navigate }) {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("public-profile")

  if (!user) {
    navigate("auth")
    return null
  }

  return (
    <div className="page-container">
      <Header currentPage="account" navigate={navigate} />

      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar">
          <button
            className={`sidebar-item ${activeSection === "public-profile" ? "active" : ""}`}
            onClick={() => setActiveSection("public-profile")}
          >
            Public Profile
          </button>
          <button
            className={`sidebar-item ${activeSection === "personal-info" ? "active" : ""}`}
            onClick={() => setActiveSection("personal-info")}
          >
            Personal Information
          </button>
          <button
            className={`sidebar-item ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            Security
          </button>
          <button
            className={`sidebar-item ${activeSection === "billing" ? "active" : ""}`}
            onClick={() => setActiveSection("billing")}
          >
            Billing and Plans
          </button>
        </aside>

        {/* Main Content */}
        <main className="account-content">
          {activeSection === "public-profile" && <PublicProfileSection user={user} />}
          {activeSection === "personal-info" && <PersonalInfoSection user={user} />}
          {activeSection === "security" && <SecuritySection />}
          {activeSection === "billing" && <BillingSection />}
        </main>
      </div>
    </div>
  )
}

function PublicProfileSection({ user }) {
  return (
    <div className="section-content">
      <div className="form-section">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" className="form-input" defaultValue={user.name || "Arlan"} />
          <p className="form-hint">The name that will be displayed to other users</p>
        </div>

        <div className="form-group">
          <label className="form-label">Username</label>
          <div className="username-input">
            <span className="username-prefix">@</span>
            <input type="text" className="form-input" defaultValue={user.username || "NeArlan"} />
          </div>
          <p className="form-hint">A unique name that other users can use to find you</p>
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-textarea" placeholder="Tell us a little about yourself" rows={6}></textarea>
          <p className="form-hint">Description of your profile</p>
        </div>
      </div>

      <div className="profile-picture-section">
        <h3 className="section-subtitle">Profile Picture</h3>
        <div className="profile-picture-container">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Account%20Page,%20Public%20Profile-Wjko7.png"
            alt="Profile"
            className="profile-picture"
          />
          <button className="edit-picture-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
              <path d="M11.5 1.5L14.5 4.5L5 14H2V11L11.5 1.5Z" />
            </svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

function PersonalInfoSection({ user }) {
  return (
    <div className="section-content">
      <div className="form-section">
        <div className="form-group">
          <label className="form-label">Email</label>
          <div className="input-with-badge">
            <input type="email" className="form-input" defaultValue={user.email} readOnly />
            <span className="verified-badge">Verified</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div className="input-with-button">
            <input type="tel" className="form-input" placeholder="+77771234567" />
            <button className="verify-btn">Verify</button>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>I do not want to receive information about promotions and upcoming events</span>
          </label>
        </div>

        <div className="friends-section">
          <h3 className="section-subtitle">Friends List</h3>
          <div className="add-friend">
            <span className="username-prefix">@</span>
            <input type="text" className="form-input" placeholder="Add Friend by Username" />
            <button className="add-btn">Add</button>
          </div>

          <div className="friends-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="friend-item">
                <div className="friend-avatar"></div>
                <div className="friend-name">Friend {i}</div>
                <button className="delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="promo-card">
        <h3 className="promo-title">More Friends, More Fun</h3>
        <p className="promo-text">There are no limit to adding friends</p>
        <img src="/friends-illustration.jpg" alt="Friends illustration" className="promo-image" />
      </div>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="section-content">
      <div className="form-section">
        <div className="security-group">
          <h3 className="section-subtitle">Password</h3>
          <button className="action-btn">Change Password</button>
          <p className="form-hint">Strengthen your account by ensuring your password is strong.</p>
        </div>

        <div className="security-group">
          <h3 className="section-subtitle">Two-factor authentication</h3>

          <div className="auth-method">
            <div>
              <p className="auth-method-title">SMS/Text message</p>
              <p className="form-hint">You will receive one-time codes at your phone number</p>
            </div>
            <button className="action-btn">Add</button>
          </div>

          <div className="auth-method">
            <div>
              <p className="auth-method-title">
                Email message <span className="configured-badge">Configured</span>
              </p>
              <p className="form-hint">You will receive Confirmation letter at your email</p>
            </div>
            <button className="action-btn">Edit</button>
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>I don't want to receive personalized ads.</span>
          </label>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input type="checkbox" />
            <span>
              I don't want the information obtained based on the actions inside the <strong>WatchParty</strong> to be
              transferred to third-party applications.
            </span>
          </label>
        </div>
      </div>

      <div className="security-card">
        <h3 className="security-card-title">Your Account is secured</h3>
        <p className="security-card-text">
          We use advanced encryption methods to ensure maximum security of your account
        </p>
        <img src="/security-lock.jpg" alt="Security" className="security-image" />
      </div>
    </div>
  )
}

function BillingSection() {
  return (
    <div className="section-content-full">
      <div className="billing-layout">
        <div className="billing-form">
          <h3 className="section-subtitle">Payment Information</h3>

          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input type="text" className="form-input" placeholder="1234 5678 9012 3456" />
          </div>

          <div className="form-group">
            <label className="form-label">Card Holder :</label>
            <input type="text" className="form-input" placeholder="John Doe" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Expires On :</label>
              <input type="text" className="form-input" placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label className="form-label">CVV :</label>
              <input type="text" className="form-input" placeholder="123" />
            </div>
          </div>

          <button className="save-btn">Save billing information</button>
        </div>

        <div className="payment-method-card">
          <h3 className="section-subtitle">Payment Method</h3>
          <img src="/credit-cards.jpg" alt="Credit cards" className="cards-image" />
          <p className="security-note">All your payment data is securely protected</p>
        </div>
      </div>

      <div className="subscription-section">
        <h3 className="section-subtitle">Subscription Plans</h3>
        <div className="subscription-placeholder">
          <p>No active subscriptions</p>
        </div>
      </div>
    </div>
  )
}
