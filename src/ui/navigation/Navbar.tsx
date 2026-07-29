import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex bg-neutral-700 px-8 py-4 justify-between text-white items-center fixed top-0 w-full z-10">
      <h2 className="text-white text-2xl font-bold">Just Intonation Tools</h2>
      <button
        className="md:hidden text-2xl text-white cursor-pointer mr-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <ul
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col md:flex md:flex-row md:gap-6 gap-4 
        absolute md:static top-16 left-0 w-full md:w-auto 
        bg-neutral-700 md:bg-transparent p-4 md:p-0 text-center`}
      >
        <li>
          <Link
            to="/"
            className="text-white hover:text-yellow-400 hover:underline transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/about"
            className="text-white hover:text-yellow-400 hover:underline transition"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            to="/calculator"
            className="text-white hover:text-yellow-400 hover:underline transition"
            onClick={() => setMenuOpen(false)}
          >
            Set Calculator
          </Link>
        </li>
        <li>
          <Link
            to='/spiral'
            className="text-white hover:text-yellow-400 hover:underline transition"
            onClick={() => setMenuOpen(false)}
          >
            Harmonic Spiral
          </Link>
        </li>
        <li>
          <Link
            to="/lattice"
            className="text-white hover:text-yellow-400 hover:underline transition"
            onClick={() => setMenuOpen(false)}
          >
            Ratio Lattice Visualizer
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;