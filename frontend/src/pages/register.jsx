import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/form.css';

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForm = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Full name required";

    if (!email.trim()) newErrors.email = "Email required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password required";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.msg || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      navigate("/login");

    } catch (err) {
      console.error('Registration failed:', err);
      setServerError("Server error");
    }
  };

  return (
    <div className="form-container">
      <form className="auth-form" onSubmit={handleForm}>
        <h1>Create Account</h1>
        <p className="form-subtitle">Join us to start booking</p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <span>{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>

        {/* ✅ Backend error */}
        {serverError && <p style={{ color: "red" }}>{serverError}</p>}

        <button type="submit">Create Account</button>

        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;