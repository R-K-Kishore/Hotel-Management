// Navbar component
// Displays the site name and navigation links

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
        Hotel Management
      </NavLink>

      {/* Hamburger button for mobile */}
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/add-hotel" onClick={closeMenu}>
            Add Hotel
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

