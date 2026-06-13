import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiUser, FiEdit, FiBarChart2 } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Navigation = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-black to-purple-900 border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-white font-bold text-xl">SKYNZ</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-300 hover:text-cyan-400 transition flex items-center gap-2">
            <FiHome size={18} />
            Dashboard
          </Link>
          <Link to="/profile" className="text-gray-300 hover:text-cyan-400 transition flex items-center gap-2">
            <FiUser size={18} />
            Profile
          </Link>
          <Link to="/page-builder" className="text-gray-300 hover:text-cyan-400 transition flex items-center gap-2">
            <FiEdit size={18} />
            Create Page
          </Link>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-sm">{user?.name || 'Creator'}</span>
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
