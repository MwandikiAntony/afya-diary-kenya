
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, FileText, User } from "lucide-react";

export default function CHVLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/chv-dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/chv-patients", label: "Patients", icon: <Users size={20} /> },
    { to: "/chv-reports", label: "Reports", icon: <FileText size={20} /> },
    { to: "/chv-profile", label: "Profile", icon: <User size={20} /> },
    { to: "/ai-helper", label: "Mental AI", icon: <User size={20} /> },
    { to: "/mental-health/tips", label: "Health Tips", icon: <User size={20} /> },
    { to: "/mood-tracker", label: "Mood Tracker", icon: <User size={20} /> },
  ];

  const handleLogout =() => {
    localStorage.removeItem ("token"); //clear token on logout
    navigate("/login");
  };

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
         <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 py-2 px-3 rounded font-semibold transition"
        >
          🚪 Logout
        </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
