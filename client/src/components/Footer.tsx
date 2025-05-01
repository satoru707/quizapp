import React from "react";
import { Github } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Footer: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`py-6 ${
        theme === "dark" ? "bg-gray-800" : "bg-gray-100"
      } transition-colors duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © {new Date().getFullYear()} StudyBuddy. All rights reserved nigga.
          </p>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a
              href="https://github.com/satoru707"
              className="text-sm hover:text-purple-500 transition-colors duration-200"
            >
              My Profile😌
            </a>
            <a
              href="https://github.com/satoru707/quizapp.git"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
