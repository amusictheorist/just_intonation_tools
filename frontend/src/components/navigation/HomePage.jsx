import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Just Intonation Tools
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Explore various tools for working with just intonation that I am
          developing based on my dissertation work in music theory, including a
          set calculator, an interactive harmonic spiral visualization, a ratio lattice generator, and more to come soon. To
          find out more about this project, please visit the{" "}
          <Link to="/about" className="text-blue-600 font-semibold hover:underline">
            About
          </Link>{" "}
          page.
        </p>
      </header>

      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Explore the Tools</h2>
        <p className="text-gray-700">Select a tool below to begin:</p>
        <ul className="list-none mt-4">
          <li className="my-4">
            <Link
              to="/calculator"
              className="inline-block bg-green-600 text-white px-6 py-3 text-lg font-semibold rounded-md transition hover:bg-green-700 hover:underline"
            >
              Set Calculator
            </Link>
          </li>
          <li className="my-4">
            <Link
              to='/spiral'
              className="inline-block bg-green-600 text-white px-6 py-3 text-lg font-semibold rounded-md transition hover:bg-green-700 hover:underline"
            >
              Harmonic Spiral
            </Link>
          </li>
          <li className="my-4">
            <Link
              to="/lattice"
              className="inline-block bg-green-600 text-white px-6 py-3 text-lg font-semibold rounded-md transition hover:bg-green-700 hover:underline"
            >
              Ratio Lattice Visualizer
            </Link>
          </li>
        </ul>
      </section>

      <footer className="bg-neutral-700 text-white p-4 text-center mt-8">
        <p className="m-0 text-white">&copy; 2025 Just Intonation Tools. All rights reserved.</p>
        <p className="mt-2 text-white">
          by{" "}
          <a
            href="https://www.amusictheorist.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white font-bold hover:text-gray-300 hover:underline"
          >
            amusictheorist
          </a>
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
