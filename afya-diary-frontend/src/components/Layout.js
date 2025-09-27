import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Redirect to landing page
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#3498db] text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-6">🏥 Afyadiary Kenya</h2>

        <nav className="flex flex-col gap-3 flex-1">
          <Link to="/dashboard" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            📊 Dashboard
          </Link>
          <Link to="/patients" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            👩‍⚕️ Patients
          </Link>
          <Link to="/appointments" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            📅 Appointments
          </Link>
          <Link to="/records" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            📂 Records
          </Link>
          <Link to="/reminders" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            ⏰ Reminders
          </Link>
          <Link to="/profile" className="py-2 px-3 rounded hover:bg-[#2980b9] transition">
            ⚙️ Profile
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 py-2 px-3 rounded font-semibold transition"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
