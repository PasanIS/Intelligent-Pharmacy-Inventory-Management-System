import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../../src/styles/pages/login.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => { // Mark as async
    e.preventDefault();
    setError('');

    const success = await login(email, password); // Await the async login call

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password.'); // Removed hardcoded suggestion
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1 className="main-logo">IPIMS</h1>
          <p className="sub-text">Intelligent Pharmacy Management System</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot your password?</a>
          </div>
          <button type="submit" className="login-btn">Log in</button>
        </form>
        <p className="signup-text">Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;