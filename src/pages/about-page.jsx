import { Link } from "react-router-dom";  
import "./about-page.css";

export default function AboutPage() {
  return (
    <div className="page-container">
      {}

      <main className="about-main">
        <section className="about-hero">
          <h1 className="about-title">About WatchParty</h1>
          <p className="about-subtitle">Bringing people together through shared viewing experiences</p>
        </section>

        <section className="about-content">
          <div className="about-card">
            <div className="card-icon" style={{ backgroundColor: "#5cb753" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="white">
                <path d="M24 4C13 4 4 13 4 24C4 35 13 44 24 44C35 44 44 35 44 24C44 13 35 4 24 4ZM24 40C15.2 40 8 32.8 8 24C8 15.2 15.2 8 24 8C32.8 8 40 15.2 40 24C40 32.8 32.8 40 24 40Z" />
                <circle cx="24" cy="24" r="8" />
              </svg>
            </div>
            <h2 className="card-title">Our Mission</h2>
            <p className="card-text">
              WatchParty was created to solve a simple problem: how can friends and family watch videos together when
              they're apart? We believe that shared experiences bring people closer, and distance shouldn't be a barrier
              to enjoying content with the people you care about.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon" style={{ backgroundColor: "#5cb753" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="white">
                <path d="M38 8H10C8.9 8 8 8.9 8 10V38C8 39.1 8.9 40 10 40H38C39.1 40 40 39.1 40 38V10C40 8.9 39.1 8 38 8ZM36 36H12V12H36V36Z" />
                <path d="M20 30L30 24L20 18V30Z" />
              </svg>
            </div>
            <h2 className="card-title">How It Works</h2>
            <p className="card-text">
              Create a room, invite your friends, and start watching together. Everything is synchronized in real-time -
              when you pause, everyone pauses. When you play, everyone plays. Chat with your friends while you watch and
              share reactions in the moment.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon" style={{ backgroundColor: "#5cb753" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="white">
                <path d="M24 4L6 14V22C6 33 13.5 43 24 44C34.5 43 42 33 42 22V14L24 4ZM24 22.5L38 14.5V22C38 30.5 32.5 38.5 24 40C15.5 38.5 10 30.5 10 22V14.5L24 22.5Z" />
                <path d="M24 12L16 16V24C16 28 19 32 24 32C29 32 32 28 32 24V16L24 12Z" />
              </svg>
            </div>
            <h2 className="card-title">Privacy & Quality</h2>
            <p className="card-text">
              We require registration for hosting rooms to ensure high-quality experiences and prevent abuse. Your
              privacy is important to us - we only collect essential information needed to provide our service. All
              rooms are private by default and only accessible to invited participants.
            </p>
          </div>

          <div className="about-card">
            <div className="card-icon" style={{ backgroundColor: "#5cb753" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="white">
                <circle cx="24" cy="14" r="8" />
                <circle cx="38" cy="18" r="6" />
                <circle cx="10" cy="18" r="6" />
                <path d="M24 24C18 24 8 27 8 33V38H40V33C40 27 30 24 24 24Z" />
                <path d="M38 26C34 26 28 27.5 28 31V34H44V31C44 27.5 42 26 38 26Z" />
                <path d="M10 26C6 26 4 27.5 4 31V34H20V31C20 27.5 14 26 10 26Z" />
              </svg>
            </div>
            <h2 className="card-title">Community First</h2>
            <p className="card-text">
              WatchParty is built for communities. Whether you're watching with close friends, family across the
              country, or meeting new people who share your interests, we provide the tools to make your viewing
              experience social, fun, and memorable.
            </p>
          </div>
        </section>

        <section className="about-cta">
          <h2 className="cta-title">Ready to start watching together?</h2>
          <div className="cta-buttons">
            <Link to="/rooms" className="cta-btn primary">
              Explore Rooms
            </Link>
            <Link to="/auth" className="cta-btn secondary">
              Create Account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
