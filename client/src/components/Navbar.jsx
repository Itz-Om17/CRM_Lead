import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          LeadCRM
        </NavLink>
        <div className="navbar-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/add" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Add Lead
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
