import React from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">Set Calculator</h2>
      <ul className="nav-links">
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
        <li><Link to='/lattice'>Lattice Generator</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;