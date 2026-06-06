import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const truncateName = (str, n = 14) => {
    return str && str.length > n ? str.slice(0, n - 1) + '…' : str;
  };

  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    logout();
  };

  const initialLetter = user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side: Logo */}
        <Link to="/" className="navbar-brand">
          LeadFlow
        </Link>

        {/* Right Side: Add Button and Profile Dropdown */}
        {user && (
          <div className="navbar-right">
            {/* Primary Action Button (New Placement) */}
            <Link to="/dashboard/add" className="nav-add-btn">
              Add New Lead
            </Link>

            {/* Profile Dropdown Wrapper */}
            <div className="nav-profile-wrapper" ref={dropdownRef}>
              <div 
                className="nav-profile-trigger" 
                onClick={handleDropdownClick}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDropdownClick();
                  }
                }}
              >
                <div className="nav-avatar">{initialLetter}</div>
                <span className="nav-user-name">{truncateName(user.name)}</span>
                <span className={`nav-chevron ${dropdownOpen ? 'open' : ''}`}>▼</span>
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="nav-dropdown" role="menu">
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-name">{user.name}</div>
                    <div className="nav-dropdown-username">@{user.username}</div>
                  </div>
                  
                  <div className="nav-dropdown-divider"></div>
                  
                  <div 
                    className="nav-dropdown-item" 
                    onClick={handleProfileClick}
                    role="menuitem"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleProfileClick();
                    }}
                  >
                    My Profile
                  </div>
                  
                  <div className="nav-dropdown-divider"></div>
                  
                  <div 
                    className="nav-dropdown-item danger" 
                    onClick={handleLogoutClick}
                    role="menuitem"
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLogoutClick();
                    }}
                  >
                    Sign Out
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
