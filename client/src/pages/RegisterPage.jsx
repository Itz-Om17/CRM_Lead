import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/leadsApi';
import { useToast } from '../components/Toast';
import '../styles/auth.css';

function RegisterPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    // Name Validation (min 2 chars)
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Username Validation (alphanumeric only, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!usernameRegex.test(username)) {
      newErrors.username = 'Letters and numbers only, 3-20 characters';
    }

    // Email Validation (optional, but if provided must be valid format)
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Password Validation (min 6 chars)
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors({});

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const regData = {
        name: name.trim(),
        username: username.trim(),
        password
      };
      
      if (email.trim()) {
        regData.email = email.trim().toLowerCase();
      }

      const res = await registerUser(regData);
      if (res.success && res.token && res.data) {
        login(res.token, res.data);
        showToast('Successfully registered and signed in!', 'success');
        navigate('/dashboard');
      } else {
        setGlobalError(res.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors && typeof data.errors === 'object') {
          // Map backend express-validator errors to fields if present
          const newErrors = {};
          Object.keys(data.errors).forEach((key) => {
            newErrors[key] = data.errors[key];
          });
          setFieldErrors(newErrors);
        } else if (data.message) {
          setGlobalError(data.message);
        } else {
          setGlobalError('Registration failed.');
        }
      } else {
        setGlobalError('Server error. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-back-row register-width">
        <Link to="/" className="auth-back-link">
          &larr; Back to Home
        </Link>
      </div>
      <div className="auth-card auth-card-register">
        <div className="auth-brand">LeadFlow</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start managing your leads today</p>

        {globalError && <div className="auth-global-error">{globalError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-form-grid">
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
              {fieldErrors.name && <span className="form-error-msg">{fieldErrors.name}</span>}
            </div>

            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <span className="input-hint">Letters/numbers, 3-20 chars</span>
              {fieldErrors.username && <span className="form-error-msg">{fieldErrors.username}</span>}
            </div>

            {/* Email Field (Optional) */}
            <div className="form-group form-group-full">
              <label htmlFor="email" className="form-label">Email (optional)</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              {fieldErrors.email && <span className="form-error-msg">{fieldErrors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <span className="input-hint">Minimum 6 characters</span>
              {fieldErrors.password && <span className="form-error-msg">{fieldErrors.password}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {fieldErrors.confirmPassword && <span className="form-error-msg">{fieldErrors.confirmPassword}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-footer-link">Sign in &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
