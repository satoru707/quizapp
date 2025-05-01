import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Book, History, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "border-b-2 border-purple-500"
      : "hover:text-purple-500";
  };

  return (
    <header
      className={`sticky top-0 z-10 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } shadow-md transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold">StudyBuddy</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`${isActive("/")} transition-colors duration-200`}
            >
              Home
            </Link>
            <Link
              to="/questions"
              className={`${isActive(
                "/questions"
              )} transition-colors duration-200`}
            >
              Questions
            </Link>
            <Link
              to="/history"
              className={`${isActive(
                "/history"
              )} transition-colors duration-200`}
            >
              History
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <div className="md:hidden">
              <Link to="/history" className="p-2">
                <History className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
