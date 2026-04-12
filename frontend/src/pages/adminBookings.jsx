import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/admin.css';
import { bookingAPI } from '../api/axios';
import { getAuthSnapshot, clearAuthSession } from '../utils/auth';

const STORAGE_KEY = 'admin_bookings';

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (!token || role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data } = await bookingAPI.getAllAdmin();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  const clearBookings = () => setBookings([]);

  const cancelBooking = async (id) => {
    try {
      await bookingAPI.cancel(id);
      // Refresh bookings
      const { data } = await bookingAPI.getAllAdmin();
      setBookings(data);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const logout = () => {
    clearAuthSession();
    navigate('/admin/login', { replace: true });
  };

  const sorted = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookings]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);

    return { total, confirmed, cancelled, pending, totalRevenue };
  }, [bookings]);

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-sidebar">
          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="admin-sidebar-nav">
            <a href="/admin/dashboard" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">📊</span>
              Dashboard
            </a>
            <a href="/admin/users" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">👥</span>
              Users
            </a>
            <a href="/admin/hotels" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">🏨</span>
              Hotels
            </a>
            <a href="/admin/bookings" className="admin-sidebar-link active">
              <span className="admin-sidebar-icon">📅</span>
              Bookings
            </a>
            <a href="/admin/analytics" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">📈</span>
              Analytics
            </a>
          </nav>
        </div>
        <div className="admin-main-content">
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-sidebar-nav">
          <a href="/admin/dashboard" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">📊</span>
            Dashboard
          </a>
          <a href="/admin/users" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">👥</span>
            Users
          </a>
          <a href="/admin/hotels" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">🏨</span>
            Hotels
          </a>
          <a href="/admin/bookings" className="admin-sidebar-link active">
            <span className="admin-sidebar-icon">📅</span>
            Bookings
          </a>
          <a href="/admin/analytics" className="admin-sidebar-link">
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
          <h1>Manage Bookings</h1>
          <p className="admin-subtitle">View and manage all bookings across the platform</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📅</div>
            <div className="admin-stat-content">
              <h3>{stats.total}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">✅</div>
            <div className="admin-stat-content">
              <h3>{stats.confirmed}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">⏳</div>
            <div className="admin-stat-content">
              <h3>{stats.pending}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">❌</div>
            <div className="admin-stat-content">
              <h3>{stats.cancelled}</h3>
              <p>Cancelled</p>
            </div>
          </div>
          <div className="admin-stat-card revenue-card">
            <div className="admin-stat-icon">💰</div>
            <div className="admin-stat-content">
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="admin-content-section">
          <div className="admin-section-header">
            <h2>All Bookings</h2>
            <div className="admin-section-actions">
              <button className="admin-btn-secondary" onClick={clearBookings}>
                Clear All
              </button>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📅</div>
              <h3>No bookings found</h3>
              <p>All bookings will appear here once users start making reservations.</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Hotel</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Rooms</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((booking) => (
                    <tr key={booking._id}>
                      <td>
                        <div className="admin-table-cell-primary">
                          {booking.user?.name || 'N/A'}
                        </div>
                        <div className="admin-table-cell-secondary">
                          {booking.user?.email || ''}
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-cell-primary">
                          {booking.hotel?.name || 'N/A'}
                        </div>
                        <div className="admin-table-cell-secondary">
                          {booking.hotel?.location || ''}
                        </div>
                      </td>
                      <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                      <td>{booking.numberOfRooms}</td>
                      <td className="admin-table-price">₹{booking.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`admin-status-pill ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          {booking.status === 'confirmed' && (
                            <button
                              className="admin-btn-danger admin-btn-sm"
                              onClick={() => cancelBooking(booking._id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;