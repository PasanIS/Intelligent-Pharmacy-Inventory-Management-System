import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/pages/signup.css';

const SignUpPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const success = await signup(fullName, email, password, confirmPassword);
      if (success) {
        setSuccess('Sign up successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect after 2 seconds
      } else {
        setError('Sign up failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during sign up.');
      console.error('Sign up failed:', err);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <div className="signup-header">
          <h1 className="main-logo">IPIMS</h1>
          <p className="sub-text">Create your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-text">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
};

export default SignUpPage;