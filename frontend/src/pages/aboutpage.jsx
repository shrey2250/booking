import React from "react";
import '../components/about.css';

function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>About StayFinder</h1>
          <p>Connecting travelers with extraordinary places since 2024</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At StayFinder, we believe that every journey should begin with the perfect stay.
              We're dedicated to connecting travelers with exceptional accommodations worldwide,
              making it easier than ever to discover and book amazing places to stay.
            </p>
            <p>
              Our platform combines cutting-edge technology with personalized service to create
              unforgettable experiences for every traveler, from budget-conscious explorers to
              luxury seekers.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose StayFinder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Find the perfect hotel with our advanced search filters and personalized recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Quality Assurance</h3>
              <p>Every property is verified and reviewed to ensure you get the best experience possible.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Booking</h3>
              <p>Book with confidence using our secure payment system and 24/7 customer support.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>Access thousands of properties in hundreds of destinations around the world.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Book on the go with our responsive design that works perfectly on all devices.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Best Prices</h3>
              <p>Get the best deals with our price comparison and exclusive member discounts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Hotels Worldwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500,000+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8/5</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👨‍💼</div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">Passionate about travel and technology, Sarah founded StayFinder to revolutionize the way people book accommodations.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👩‍💻</div>
              <h3>Maria Rodriguez</h3>
              <p className="member-role">Head of Technology</p>
              <p className="member-bio">Leading our tech team to build innovative solutions that make travel planning seamless and enjoyable.</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">👨‍🎨</div>
              <h3>David Chen</h3>
              <p className="member-role">Design Director</p>
              <p className="member-bio">Creating beautiful, intuitive interfaces that enhance the travel experience for our users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join millions of travelers who trust StayFinder for their perfect stay.</p>
            <div className="cta-buttons">
              <a href="/register" className="cta-btn primary">Get Started</a>
              <a href="/hotels" className="cta-btn secondary">Explore Hotels</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;