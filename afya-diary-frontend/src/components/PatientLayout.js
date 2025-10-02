import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ClipboardList, Bell, User } from "lucide-react";

export default function PatientLayout({ children }) {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Home", icon: <Home size={20} /> },
    { to: "/appointments", label: "Appointments", icon: <ClipboardList size={20} /> },
    { to: "/notifications", label: "Notifications", icon: <Bell size={20} /> },
    { to: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#00695C] text-white flex flex-col">
        <div className="p-6 font-bold text-2xl border-b border-green-800">
          Patient Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === link.to
                  ? "bg-green-800 text-white"
                  : "hover:bg-green-700 hover:text-white"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
