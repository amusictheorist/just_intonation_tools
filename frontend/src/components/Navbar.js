import React, { useState } from "react";
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <h2 className="logo">Just Intonation Tools</h2>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to='/' onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to='/about' onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to='/calculator' onClick={() => setMenuOpen(false)}>Set Calculator</Link></li>
        <li><Link to='/lattice' onClick={() => setMenuOpen(false)}>Ratio Lattice Generator</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
