import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/logout");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      <div className="relative">
        {/* User Menu */}
        <button
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <span className="text-gray-800 font-medium">Admin</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <button
              onClick={goToProfile}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;