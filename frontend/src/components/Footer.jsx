import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🏨</span>
              <span className="logo-text">StayFinder</span>
            </div>
            <p className="footer-description">
              Discover amazing places to stay around the world. From luxury hotels to cozy homes,
              find your perfect accommodation with StayFinder.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/safety">Safety Information</a></li>
              <li><a href="/cancellation">Cancellation Options</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Hosting</h3>
            <ul>
              <li><a href="/become-host">Become a Host</a></li>
              <li><a href="/host-resources">Host Resources</a></li>
              <li><a href="/community">Community</a></li>
              <li><a href="/responsible-hosting">Responsible Hosting</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 StayFinder. All rights reserved.</p>
            <div className="footer-languages">
              <select className="language-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <select className="currency-select">
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="inr">INR</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;