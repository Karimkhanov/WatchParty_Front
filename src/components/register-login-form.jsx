// "use client"

// import { useState } from "react"
// import "./register-login-form.css"

// export default function RegisterLoginForm() {
//   const [activeTab, setActiveTab] = useState("register")
//   const [showForgotPassword, setShowForgotPassword] = useState(false)

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     // Handle form submission
//     console.log("Form submitted")
//   }

//   const handleForgotPassword = (e) => {
//     e.preventDefault()
//     setShowForgotPassword(true)
//     setActiveTab("register") // Switch to register tab as shown in design
//   }

//   const handleBackToLogin = () => {
//     setShowForgotPassword(false)
//     setActiveTab("login")
//   }

//   return (
//     <div className="auth-container">
//       {/* Header */}
//       <header className="header">
//         <div className="logo">WatchParty</div>
//         <nav className="nav">
//           <a href="#" className="nav-link active">
//             Home
//           </a>
//           <a href="#" className="nav-link">
//             Rooms
//           </a>
//           <a href="#" className="nav-link">
//             About Us
//           </a>
//         </nav>
//         <div className="header-actions">
//           <button className="sign-in-btn">
//             Sign In
//             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//               <path
//                 d="M6 12L10 8L6 4"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>
//           <div className="theme-toggle">
//             <button className="theme-btn">
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                 <circle cx="10" cy="10" r="4" />
//                 <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 16.364L14.95 14.95M5.05 5.05L3.636 3.636M16.364 3.636L14.95 5.05M5.05 14.95L3.636 16.364" />
//               </svg>
//             </button>
//             <button className="theme-btn active">
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="main-content">
//         <div className="form-card">
//           {/* Tabs */}
//           <div className="tabs">
//             <button
//               className={`tab ${activeTab === "register" ? "active" : ""}`}
//               onClick={() => {
//                 setActiveTab("register")
//                 setShowForgotPassword(false)
//               }}
//             >
//               Register
//             </button>
//             <button
//               className={`tab ${activeTab === "login" ? "active" : ""}`}
//               onClick={() => {
//                 setActiveTab("login")
//                 setShowForgotPassword(false)
//               }}
//             >
//               Login
//             </button>
//           </div>

//           {/* Form */}
//           <form className="form" onSubmit={handleSubmit}>
//             {showForgotPassword ? (
//               <>
//                 <div className="form-group">
//                   <label htmlFor="forgot-username" className="form-label">
//                     Username
//                   </label>
//                   <input type="text" id="forgot-username" className="form-input" required />
//                 </div>

//                 <p className="helper-text">Create a unique name for your account so that other users can find you</p>

//                 <button type="submit" className="submit-btn">
//                   Create Account
//                 </button>
//               </>
//             ) : activeTab === "register" ? (
//               <>
//                 <div className="form-group">
//                   <label htmlFor="email" className="form-label">
//                     Email
//                   </label>
//                   <input type="email" id="email" className="form-input" required />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password" className="form-label">
//                     Password
//                   </label>
//                   <input type="password" id="password" className="form-input" required />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="password-again" className="form-label">
//                     Password Again
//                   </label>
//                   <input type="password" id="password-again" className="form-input" required />
//                 </div>

//                 <button type="submit" className="submit-btn">
//                   Submit
//                 </button>
//               </>
//             ) : (
//               <>
//                 <div className="form-group">
//                   <label htmlFor="login-username" className="form-label">
//                     Username or Email
//                   </label>
//                   <input type="text" id="login-username" className="form-input" required />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="login-password" className="form-label">
//                     Password
//                   </label>
//                   <input type="password" id="login-password" className="form-input" required />
//                 </div>

//                 <button type="submit" className="submit-btn">
//                   Submit
//                 </button>

//                 <a href="#" className="forgot-password" onClick={handleForgotPassword}>
//                   FORGET YOUR PASSWORD?
//                 </a>
//               </>
//             )}
//           </form>
//         </div>
//       </main>
//     </div>
//   )
// }
