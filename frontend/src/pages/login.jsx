import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/form.css';
import { authAPI } from '../api/axios';
import { setAuthSession } from '../utils/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError('');
    setIsSubmitting(true);

    try {
      const { data } = await authAPI.login({
        email,
        password,
      });

      setAuthSession(data.token, data.user.role);

      navigate('/');
    } catch (error) {
      setServerError(error.response?.data?.error || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleForm}>
        <h1>Welcome Back</h1>
        <p className="form-subtitle">Sign in to your account</p>

        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        {serverError && <p style={{ color: 'red' }}>{serverError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <p>
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
