import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContextDefinition';
import '../../styles/common/header.css';

interface HeaderProps {
  activePage: 'Dashboard' | 'Inventory' | 'Alerts' | 'Suppliers';
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    authContext?.logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo-section">
        <span className="logo-text">IPIMS</span>
      </div>
      <nav className="nav-menu">
        <Link to="/dashboard" className={`nav-link ${activePage === 'Dashboard' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/inventory" className={`nav-link ${activePage === 'Inventory' ? 'active' : ''}`}>Inventory</Link>
        <Link to="/alerts" className={`nav-link ${activePage === 'Alerts' ? 'active' : ''}`}>Alerts</Link>
        <Link to="/suppliers" className={`nav-link ${activePage === 'Suppliers' ? 'active' : ''}`}>Suppliers</Link>
      </nav>
      <div className="user-profile">
        <span>Hello, Pasan!</span>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
};

export default Header;