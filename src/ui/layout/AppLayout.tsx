import { Outlet } from "react-router-dom";
import Navbar from "../navigation/Navbar";

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />

      <main className="flex min-h-0 flex-1 flex-col pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
