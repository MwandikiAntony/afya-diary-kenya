import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, User } from "lucide-react";

export default function CHVLayout({ children }) {
  const location = useLocation();

  const links = [
    { to: "/chv-dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/chv-patients", label: "Patients", icon: <Users size={20} /> },
    { to: "/chv-reports", label: "Reports", icon: <FileText size={20} /> },
    { to: "/chv-profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#4A148C] text-white flex flex-col">
        <div className="p-6 font-bold text-2xl border-b border-purple-900">
          CHV Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                location.pathname === link.to
                  ? "bg-purple-900 text-white"
                  : "hover:bg-purple-800 hover:text-white"
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
