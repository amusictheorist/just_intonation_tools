import React from "react";
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <h1>Just Intonation Tools</h1>
        <p className="description">
          Explore various tools for working with just intonation that I am developing based on my dissertation work in music theory, including a set calculator, a ratio lattice generator, and more to come soon. To find out more about this project, please visit the <Link to='/about'>About</Link> page.
        </p>
      </header>
      <section className="tools-section">
        <h2>Explore the Tools</h2>
        <p> Select a tool below to begin:</p>
        <ul className="tools-list">
          <li>
            <Link to='/calculator'>Set Calculator</Link>
          </li>
          <li>
            <Link to='/lattice'>Ratio Lattice Generator</Link>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Just Intonation Tools. All rights reserved.</p>
        <p className="credit">
        by <a href="https://www.amusictheorist.com" target="_blank" rel="noopener noreferrer" className="underline">amusictheorist</a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
