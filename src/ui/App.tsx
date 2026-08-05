import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AboutPage from "./navigation/AboutPage";
import HomePage from "./navigation/HomePage";
import Calculator from "./tools/Calculator";
import Lattice from "./tools/Lattice";
import Spiral from "./tools/Spiral";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/spiral" element={<Spiral />} />
          <Route path="/lattice" element={<Lattice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
