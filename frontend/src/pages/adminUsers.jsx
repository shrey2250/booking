import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/admin.css';
import { authAPI } from '../api/axios';
import { getAuthSnapshot, clearAuthSession } from '../utils/auth';

const STORAGE_KEY = 'admin_users';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (!token || role !== 'admin') {
      navigate('/admin/login', { replace: true });
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await authAPI.getAllUsers();
        
        // Safely ensure all users have a bookings array
        const safeUsers = Array.isArray(data) ? data.map(user => ({
          ...user,
          bookings: Array.isArray(user.bookings) ? user.bookings : []
        })) : [];
        
        setUsers(safeUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const logout = () => {
    clearAuthSession();
    navigate('/admin/login', { replace: true });
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length,
    totalBookings: users.reduce((sum, user) => sum + (user.bookings?.length || 0), 0)
  };

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
            <a href="/admin/users" className="admin-sidebar-link active">
              <span className="admin-sidebar-icon">👥</span>
              Users
            </a>
            <a href="/admin/hotels" className="admin-sidebar-link">
              <span className="admin-sidebar-icon">🏨</span>
              Hotels
            </a>
            <a href="/admin/bookings" className="admin-sidebar-link">
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
            <p>Loading users...</p>
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
          <a href="/admin/users" className="admin-sidebar-link active">
            <span className="admin-sidebar-icon">👥</span>
            Users
          </a>
          <a href="/admin/hotels" className="admin-sidebar-link">
            <span className="admin-sidebar-icon">🏨</span>
            Hotels
          </a>
          <a href="/admin/bookings" className="admin-sidebar-link">
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
          <h1>User Management</h1>
          <p className="admin-subtitle">Manage registered users and their account status</p>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>
            <div className="admin-stat-content">
              <h3>{stats.total}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👑</div>
            <div className="admin-stat-content">
              <h3>{stats.admins}</h3>
              <p>Administrators</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">👤</div>
            <div className="admin-stat-content">
              <h3>{stats.regularUsers}</h3>
              <p>Regular Users</p>
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📅</div>
            <div className="admin-stat-content">
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
        </div>

        <div className="admin-content-section">
          <div className="admin-section-header">
            <h2>All Users</h2>
            <div className="admin-section-actions">
              <button className="admin-btn-secondary">
                Export Users
              </button>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">👥</div>
              <h3>No users found</h3>
              <p>User registrations will appear here once users sign up.</p>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Contact</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-table-cell-primary">
                          {user.name}
                        </div>
                        <div className="admin-table-cell-secondary">
                          ID: {user._id.slice(-6)}
                        </div>
                      </td>
                      <td>
                        <div className="admin-table-cell-primary">
                          {user.email}
                        </div>
                        <div className="admin-table-cell-secondary">
                          {user.phoneNumber || 'No phone'}
                        </div>
                      </td>
                      <td>
                        <span className={`admin-status-pill ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className="admin-badge">
                          {user.bookings?.length || 0}
                        </span>
                      </td>
                      <td>
                        <span className="admin-status-pill active">
                          Active
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <button className="admin-btn-secondary admin-btn-sm">
                            View
                          </button>
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

export default AdminUsers;