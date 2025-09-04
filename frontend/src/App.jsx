import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SpiralPage from './components/spiral/SpiralPage';
import HomePage from './components/navigation/HomePage';
import Navbar from './components/navigation/Navbar';
import AboutPage from './components/navigation/AboutPage';
import LatticePage from './components/lattice/LatticePage';
import CalculatorPage from './components/calculator/CalculatorPage';


function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/calculator' element={<CalculatorPage />} />
          <Route path='/spiral' element={<SpiralPage />} />
          <Route path='/lattice' element={<LatticePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
