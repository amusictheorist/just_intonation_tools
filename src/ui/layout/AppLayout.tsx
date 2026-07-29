import { Outlet } from "react-router-dom";
import Navbar from "../navigation/Navbar";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
