import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/admin.css';
import { authAPI } from '../api/axios';
import { getAuthSnapshot, setAuthSession } from '../utils/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { token, role } = getAuthSnapshot();

    if (token && role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await authAPI.login({
        email: credentials.username,
        password: credentials.password,
      });

      if (data.user?.role !== 'admin') {
        setError('Admin access required');
        return;
      }

      setAuthSession(data.token, data.user.role);

      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-header">
          <h1><span style={{ fontSize: '2.5rem', marginRight: '12px' }}>🏨</span>StayFinder</h1>
          <p>Admin Portal</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <i>⚠️</i> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Email Address</label>
            <input
              type="email"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin@stayfinder.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="admin-button primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <i>🔐</i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px' }}>
          <p>Demo Credentials:</p>
          <p><strong>Email:</strong> admin@stayfinder.com</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
