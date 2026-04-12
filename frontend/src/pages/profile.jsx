import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/axios';
import { clearAuthSession } from '../utils/auth';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Unable to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div>
            <h1>My Profile</h1>
            <p>Manage your account and view your booking details.</p>
          </div>
        </div>

        {loading && <p>Loading profile...</p>}
        {error && <p className="error-message">{error}</p>}

        {user && (
          <div className="profile-details">
            <div className="profile-row">
              <span>Name</span>
              <strong>{user.name || 'Guest'}</strong>
            </div>
            <div className="profile-row">
              <span>Email</span>
              <strong>{user.email || 'Not available'}</strong>
            </div>
            <div className="profile-row">
              <span>Role</span>
              <strong>{user.role || 'User'}</strong>
            </div>
            <div className="profile-row">
              <span>Joined</span>
              <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</strong>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/bookings')}>
            View Bookings
          </button>
          <button type="button" className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
