import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import AboutPage from './components/AboutPage';
import LatticePage from './components/LatticePage';
import CalculatorPage from './components/CalculatorPage';
import './styles/styles.css'

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/calculator' element={<CalculatorPage />} />
          <Route path='/lattice' element={<LatticePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
