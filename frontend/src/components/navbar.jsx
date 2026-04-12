import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar({ isAuthenticated, onLogout }) {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">🏨</span>
            StayFinder
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/hotels" className="nav-link">Hotels</Link>
            <Link to="/bookings" className="nav-link">My Bookings</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>

            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link login-btn">Sign In</Link>
                <Link to="/register" className="nav-link signup-btn">Sign Up</Link>
              </>
            ) : (
              <div className="user-menu">
                <div className="user-avatar">
                  <span>👤</span>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <button type="button" onClick={onLogout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
