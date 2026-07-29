import { Link } from "react-router-dom";
import PageLayout from "../layout/PageLayout";
import PageHeader from "../layout/PageHeader";
import ContentCard from "../layout/ContentCard";

const CURRENT_YEAR = new Date(Date.now()).getFullYear();

const HomePage = () => {
  return (
    <PageLayout>
      <PageHeader
        title="Just Intonation Tools"
        description={
          <>
            Explore various tools for working with just intonation that I am
            developing based on my dissertation work in music theory, including
            a set calculator, an interactive harmonic spiral visualization, a
            ratio lattice generator, and more to come soon. To find out more
            about this project, please visit the{" "}
            <Link
              to="/about"
              className="text-blue-600 font-semibold hover:underline"
            >
              About
            </Link>{" "}
            page.
          </>
        }
      />

      <ContentCard>
        <h2 className="text-2xl font-bold text-gray-900">Explore the Tools</h2>

        <p className="mt-2 text-gray-600">Select a tool below to begin:</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            to="/calculator"
            className="rounded-lg bg-gray-700 px-5 py-4 text-center font-semibold text-white transition hover:bg-green-800 hover:underline"
          >
            Set Calculator
          </Link>

          <Link
            to="/spiral"
            className="rounded-lg bg-gray-700 px-5 py-4 text-center font-semibold text-white transition hover:bg-green-800 hover:underline"
          >
            Harmonic Spiral
          </Link>

          <Link
            to="/lattice"
            className="rounded-lg bg-gray-700 px-5 py-4 text-center font-semibold text-white transition hover:bg-green-800 hover:underline"
          >
            Ratio Lattice Visualizer
          </Link>
        </div>
      </ContentCard>

      <footer className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
        <p>&copy; {CURRENT_YEAR} Just Intonation Tools. All right reserved.</p>

        <p className="mt-2">
          by{" "}
          <a
            href="https://www.amusictheorist.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:underline"
          >
            amusictheorist
          </a>
        </p>
      </footer>
    </PageLayout>
  );
};

export default HomePage;
