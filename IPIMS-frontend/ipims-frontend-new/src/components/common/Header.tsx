import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import navbarLogo from '../../assets/images/navbar_logo.png';

interface HeaderProps {
  activePage: 'Dashboard' | 'Inventory' | 'Alerts' | 'Suppliers';
}

const Header: React.FC<HeaderProps> = ({ activePage }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="glass-header sticky top-0 z-50 flex items-center justify-between px-6 py-3">
      <div className="logo-section flex items-center gap-3 m-0 p-0">
        <img src={navbarLogo} alt="IPIMS" className="h-11 w-auto object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] rounded-lg" />
        {/* <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 hidden sm:block">
          IPIMS
        </span> */}
      </div>
      <nav className="nav-menu flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-slate-800/50">
        <Link
          to="/dashboard"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePage === 'Dashboard' ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          Dashboard
        </Link>
        <Link
          to="/inventory"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePage === 'Inventory' ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          Inventory
        </Link>
        <Link
          to="/alerts"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePage === 'Alerts' ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          Alerts
        </Link>
        <Link
          to="/suppliers"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activePage === 'Suppliers' ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
        >
          Suppliers
        </Link>
      </nav>
      <div className="user-profile flex items-center gap-4">
        <div className="flex flex-col items-end hidden md:flex">
          <span className="text-sm font-semibold text-slate-200">Hello, {user?.fullName || 'User'}</span>
          <span className="text-xs text-slate-500">Administrator</span>
        </div>
        <button
          className="logout-btn px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;