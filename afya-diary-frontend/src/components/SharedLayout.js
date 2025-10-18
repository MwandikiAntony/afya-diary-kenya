import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Heart, MessageSquare } from "lucide-react";

export default function SharedLayout({ children, role }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Role-based links
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/ai-chat", label: "AI Chat", icon: <MessageSquare size={20} /> },
    { to: "/mental-health/tips", label: "Mental Health Tips", icon: <Heart size={20} /> },
    { to: "/mood-tracker", label: "Mood Tracker", icon: <Heart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0D47A1] text-white flex flex-col">
        <div className="p-6 font-bold text-2xl border-b border-blue-900">
          {role?.toUpperCase() || "Afya Panel"}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === link.to
                  ? "bg-blue-900 text-white"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 hover:bg-red-700 py-2 px-3 rounded font-semibold transition"
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
