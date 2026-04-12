import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/admin.css';
import { getAuthSnapshot, clearAuthSession } from '../utils/auth';
import { hotelAPI, bookingAPI, authAPI } from '../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    hotels: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (!token || role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const [hotelsRes, bookingsRes, usersRes] = await Promise.all([
          hotelAPI.getAll(),
          bookingAPI.getAllAdmin(),
          authAPI.getAllUsers()
        ]);

        const hotels = hotelsRes.data || [];
        const bookings = bookingsRes.data || [];
        const users = usersRes.data || [];

        setStats({
          hotels: Array.isArray(hotels) ? hotels.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          users: Array.isArray(users) ? users.length : 0,
          revenue: Array.isArray(bookings)
            ? bookings.reduce((sum, booking) => sum + (booking?.totalPrice || 0), 0)
            : 0
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({
          hotels: 0,
          bookings: 0,
          users: 0,
          revenue: 0
        });
      }
    };

    fetchStats();
  }, [navigate]);

  const logout = () => {
    clearAuthSession();
    navigate('/admin/login', { replace: true });
  };

  const currentPath = window.location.pathname;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className={`admin-sidebar-link ${currentPath === '/admin/dashboard' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📊</span>
            Dashboard
          </a>
          <a href="/admin/users" className={`admin-sidebar-link ${currentPath === '/admin/users' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">👥</span>
            Users
          </a>
          <a href="/admin/hotels" className={`admin-sidebar-link ${currentPath === '/admin/hotels' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">🏨</span>
            Hotels
          </a>
          <a href="/admin/bookings" className={`admin-sidebar-link ${currentPath === '/admin/bookings' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📅</span>
            Bookings
          </a>
          <a href="/admin/analytics" className={`admin-sidebar-link ${currentPath === '/admin/analytics' ? 'active' : ''}`}>
            <span className="admin-sidebar-icon">📈</span>
            Analytics
          </a>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={logout} className="admin-logout-btn">
            <span className="admin-sidebar-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-header">
          <h1>Dashboard Overview</h1>
          <p className="admin-subtitle">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.hotels}</div>
                <div className="stat-label">Total Hotels</div>
              </div>
              <div className="stat-icon hotels">🏨</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.bookings}</div>
                <div className="stat-label">Total Bookings</div>
              </div>
              <div className="stat-icon bookings">📅</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.users}</div>
                <div className="stat-label">Registered Users</div>
              </div>
              <div className="stat-icon users">👥</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">₹{stats.revenue.toLocaleString()}</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="stat-icon revenue">💰</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <h2><i>⚡</i>Quick Actions</h2>
          <p>Manage your platform efficiently with these quick access tools.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
            <button
              className="admin-button primary"
              onClick={() => navigate('/admin/hotels')}
            >
              <i>➕</i>
              Add New Hotel
            </button>
            <button
              className="admin-button secondary"
              onClick={() => navigate('/admin/users')}
            >
              <i>👥</i>
              View Users
            </button>
            <button
              className="admin-button secondary"
              onClick={() => navigate('/admin/bookings')}
            >
              <i>📅</i>
              Manage Bookings
            </button>
            <button
              className="admin-button secondary"
              onClick={() => navigate('/admin/analytics')}
            >
              <i>📊</i>
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card">
          <h2><i>🔔</i>Recent Activity</h2>
          <div style={{ color: '#64748b', fontStyle: 'italic' }}>
            Activity feed will be implemented in the next update.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;