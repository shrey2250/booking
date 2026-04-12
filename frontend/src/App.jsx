import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useSyncExternalStore } from 'react';

import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Homepage from './pages/homepage.jsx';
import Hotels from './pages/hotels.jsx';
import Bookings from './pages/bookings.jsx';
import AboutPage from './pages/aboutpage.jsx';
import Contact from './pages/contact.jsx';

import AdminLogin from './pages/adminLogin.jsx';
import AdminDashboard from './pages/adminDashboard.jsx';
import AdminHotels from './pages/adminHotels.jsx';
import AdminBookings from './pages/adminBookings.jsx';
import AdminAnalytics from './pages/adminAnalytics.jsx';
import AdminUsers from './pages/adminUsers.jsx';
import Profile from './pages/profile.jsx';
import HotelDetails from './pages/hotelDetails.jsx';
import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';
import { clearAuthSession, getAuthSnapshot, subscribeToAuth } from './utils/auth';

import './App.css';

const ProtectedRoute = ({ children }) => {
  const { token } = getAuthSnapshot();
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { token, role } = getAuthSnapshot();

  return token && role === 'admin'
    ? children
    : <Navigate to="/admin/login" replace />;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const authState = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getAuthSnapshot,
  );

  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthenticated = Boolean(authState.token);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return (
    <div className="app">
      {!isAdminPage && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/hotels"
            element={(
              <ProtectedRoute>
                <Hotels />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/hotels/:id"
            element={(
              <ProtectedRoute>
                <HotelDetails />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/bookings"
            element={(
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />

          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={(
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            )}
          />

          <Route
            path="/admin/users"
            element={(
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            )}
          />

          <Route
            path="/admin/hotels"
            element={(
              <AdminRoute>
                <AdminHotels />
              </AdminRoute>
            )}
          />

          <Route
            path="/admin/bookings"
            element={(
              <AdminRoute>
                <AdminBookings />
              </AdminRoute>
            )}
          />

          <Route
            path="/admin/analytics"
            element={(
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            )}
          />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
