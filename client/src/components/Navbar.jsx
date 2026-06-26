import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
        location.pathname === to
          ? "bg-primary text-white"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 h-14 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">⚔️</span>
        <span className="text-base font-medium text-gray-900 dark:text-white">
          LifeQuest
        </span>
      </div>

      {/* Nav Tabs */}
      <div className="flex items-center gap-1">
        {navLink("/dashboard", "Today")}
        {navLink("/history", "History")}
        {navLink("/goals", "Goals")}
      </div>

      {/* Avatar dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-dark flex items-center justify-center text-xs font-medium text-primary-dark dark:text-white hover:ring-2 hover:ring-primary transition-all"
        >
          {initials}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-1 min-w-44">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                toggleDark();
                setMenuOpen(false);
              }}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
            >
              <span>{dark ? "Toggle Light mode" : "Toggle Dark mode"}</span>
              <span>{dark ? "☀️" : "🌙"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
