// src/pages/home-page.jsx

// import Header from "../components/header" // <-- ЛИШНИЙ импорт по-прежнему удален
import { Link } from "react-router-dom" // <-- ИСПОЛЬЗУЕМ Link для навигации
import "./home-page.css"

// export default function HomePage({ navigate }) { // <-- Пропсы navigate НЕ НУЖНЫ
export default function HomePage() {
  return (
    // Возвращаем вашу оригинальную обертку, она важна для стилей
    <div className="page-container">
      {/* <Header /> <-- Этот вызов по-прежнему ЛИШНИЙ */}

      <main className="home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Watch videos together with friends anywhere.</h1>
            <p className="hero-subtitle">No download required.</p>
          </div>
          <div className="hero-image">
            <img src="/retro-orange-vintage-tv-set-with-antenna.jpg" alt="Retro TV" />
          </div>
        </section>

        {/* CTA Cards */}
        <section className="cta-section">
          <div className="cta-card">
            <h2 className="cta-title">Join any room now, registration is not needed</h2>
            <Link to="/rooms" className="cta-button">
              Explore Rooms
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <div className="cta-illustration">
              <img src="/two-people-sitting-on-orange-couch-watching-tv-tog.jpg" alt="People watching together" />
            </div>
          </div>

          <div className="cta-card">
            <h2 className="cta-title">To host a room, you need to sign in.</h2>
            <p className="cta-description">
              In order to provide high quality services we allow only registered users to create and host rooms, you can
              read more about it in{" "}
              <Link to="/about" className="cta-link">
                About Us
              </Link>{" "}
              page
            </p>
            <Link to="/auth" className="cta-button">
              Sign In
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: "#4ade80" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <path
                  d="M32 8C32 8 24 16 24 24C24 28.4183 27.5817 32 32 32C36.4183 32 40 28.4183 40 24C40 16 32 8 32 8Z"
                  fill="currentColor"
                />
                <path
                  d="M32 56C32 56 40 48 40 40C40 35.5817 36.4183 32 32 32C27.5817 32 24 35.5817 24 40C24 48 32 56 32 56Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3 className="feature-title">Synchronized Play</h3>
            <p className="feature-description">Starts, stops, and seeks are synchronized to everyone.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: "#4ade80" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="12" y="16" width="40" height="32" rx="4" fill="currentColor" />
                <circle cx="20" cy="28" r="2" fill="#1a1a1a" />
                <circle cx="28" cy="28" r="2" fill="#1a1a1a" />
                <circle cx="36" cy="28" r="2" fill="#1a1a1a" />
              </svg>
            </div>
            <h3 className="feature-title">Chat</h3>
            <p className="feature-description">Chat with others in your room. Memes and inside jokes encouraged.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: "#4ade80" }}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="16" y="12" width="32" height="40" rx="2" fill="currentColor" />
                <rect x="22" y="20" width="20" height="3" rx="1.5" fill="#1a1a1a" />
                <rect x="22" y="28" width="20" height="3" rx="1.5" fill="#1a1a1a" />
                <rect x="22" y="36" width="12" height="3" rx="1.5" fill="#1a1a1a" />
                <path d="M32 44L28 48L32 52" stroke="#1a1a1a" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="feature-title">Playlists</h3>
            <p className="feature-description">
              Set up a whole list of videos to play next, and rearrange to your heart's content.
            </p>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="platforms-section">
          <h2 className="section-title">Watch Anything Together</h2>
          <div className="platform-cards">
            <div className="platform-card">
              <div className="platform-icon" style={{ backgroundColor: "#ff0000" }}>
                <svg width="80" height="56" viewBox="0 0 80 56" fill="white">
                  <path d="M78.4 8.7s-.8-5.4-3.1-7.8c-3-3.1-6.3-3.1-7.8-3.3C56.6 0 40 0 40 0s-16.6 0-27.5 1.6c-1.5.2-4.8.2-7.8 3.3C2.4 7.3 1.6 12.7 1.6 12.7S0 19.1 0 25.5v6c0 6.4 1.6 12.8 1.6 12.8s.8 5.4 3.1 7.8c3 3.1 6.9 3 8.7 3.3 6.3.6 26.6.8 26.6.8s16.6 0 27.5-1.6c1.5-.2 4.8-.2 7.8-3.3 2.3-2.4 3.1-7.8 3.1-7.8S80 37.9 80 31.5v-6c0-6.4-1.6-12.8-1.6-12.8zM31.7 38.1V15.9L53.3 27 31.7 38.1z" />
                </svg>
              </div>
              <h3 className="platform-title">Youtube</h3>
              <p className="platform-description">Watch videos together from YouTube.</p>
            </div>

            <div className="platform-card">
              <div className="platform-icon" style={{ backgroundColor: "#fbbf24" }}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="white">
                  <path d="M32 8L8 20V32C8 44 16 54 32 56C48 54 56 44 56 32V20L32 8Z" />
                  <path d="M28 32L24 36L28 40L36 32L28 24L24 28L28 32Z" fill="#1a1a1a" />
                </svg>
              </div>
              <h3 className="platform-title">File</h3>
              <p className="platform-description">Upload and stream your own file.</p>
            </div>

            <div className="platform-card">
              <div className="platform-icon" style={{ backgroundColor: "#e50914" }}>
                <span style={{ fontSize: "4rem", fontWeight: "bold" }}>N</span>
              </div>
              <h3 className="platform-title">Netflix</h3>
              <p className="platform-description">Enjoy watching movies and TV series from Netflix.</p>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="get-started-section">
          <h2 className="section-title">Get Started!</h2>
        </section>
      </main>
    </div>
  )
}
