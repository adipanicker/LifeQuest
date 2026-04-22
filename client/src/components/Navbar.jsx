import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚔️</span>
        <span className="text-base font-medium text-gray-900">LifeQuest</span>
      </div>

      {/* Nav Tabs */}
      <div className="flex-items-center gap-1">
        <Link
          to="/dashboard"
          className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
            location.pathname === "/dashboard"
              ? "bg-primary text-white"
              : "text-gray-500 hover: bg-gray-100"
          }`}
        >
          Today
        </Link>
        <Link
          to="/history"
          className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
            location.pathname === "/history"
              ? "bg-primary text-white"
              : "text-gray-500 hover: bg-gray-100"
          }`}
        >
          History
        </Link>
        <Link
          to="/goals"
          className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
            location.pathname === "/goals"
              ? "bg-primary text-white"
              : "text-gray-500 hover: bg-gray-100"
          }`}
        >
          Goals
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-medium text-primary-dark">
          {initials}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
