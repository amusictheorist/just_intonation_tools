import React from "react";
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Just Intonation Tools</h2>
      <ul className="nav-links">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/calculator'>Set Calculator</Link></li>
        <li><Link to='/lattice'>Lattice Generator</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;