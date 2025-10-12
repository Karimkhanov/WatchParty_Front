"use client"

import Header from "../components/header"
import "./home-page.css"

export default function HomePage({ navigate }) {
  return (
    <div className="page-container">
      <Header currentPage="home" navigate={navigate} />

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
            <a href="/rooms" className="cta-button">
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
            </a>
            <div className="cta-illustration">
              <img src="/two-people-sitting-on-orange-couch-watching-tv-tog.jpg" alt="People watching together" />
            </div>
          </div>

          <div className="cta-card">
            <h2 className="cta-title">To host a room, you need to sign in.</h2>
            <p className="cta-description">
              In order to provide high quality services we allow only registered users to create and host rooms, you can
              read more about it in{" "}
              <a href="/about" className="cta-link">
                About Us
              </a>{" "}
              page
            </p>
            <a href="/auth" className="cta-button">
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
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: "#5cb753" }}>
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
            <div className="feature-icon" style={{ backgroundColor: "#5cb753" }}>
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
            <div className="feature-icon" style={{ backgroundColor: "#5cb753" }}>
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
                <svg width="80" height="80" viewBox="0 0 80 80" fill="white">
                  <path d="M70 25C70 25 69 19 66 16C62.5 12.5 58.5 12.5 56.5 12.25C47.5 11.5 40 11.5 40 11.5C40 11.5 32.5 11.5 23.5 12.25C21.5 12.5 17.5 12.5 14 16C11 19 10 25 10 25C10 25 9 32 9 39V46C9 53 10 60 10 60C10 60 11 66 14 69C17.5 72.5 22 72.5 24 72.75C31 73.5 40 73.5 40 73.5C40 73.5 47.5 73.5 56.5 72.75C58.5 72.5 62.5 72.5 66 69C69 66 70 60 70 60C70 60 71 53 71 46V39C71 32 70 25 70 25ZM32 54V28L52 41L32 54Z" />
                </svg>
              </div>
              <h3 className="platform-title">Youtube</h3>
              <p className="platform-description">Watch videos together from YouTube.</p>
            </div>

            <div className="platform-card">
              <div className="platform-icon" style={{ backgroundColor: "#f4b942" }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="white">
                  <path d="M60 20H20C17.2386 20 15 22.2386 15 25V55C15 57.7614 17.2386 60 20 60H60C62.7614 60 65 57.7614 65 55V25C65 22.2386 62.7614 20 60 20Z" />
                  <path d="M30 35L45 45L30 55V35Z" fill="#f4b942" />
                  <path
                    d="M50 30L60 40L50 50"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="platform-title">File</h3>
              <p className="platform-description">Upload and stream your own file.</p>
            </div>

            <div className="platform-card">
              <div className="platform-icon" style={{ backgroundColor: "#e50914" }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="white">
                  <path d="M25 15L35 65H30L20 15H25Z" />
                  <path d="M35 15V65H40V15H35Z" />
                  <path d="M40 15L50 65H55L45 15H40Z" />
                  <path d="M55 15V65H60V15H55Z" />
                </svg>
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
