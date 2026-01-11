import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  User,
  LogOut,
  Bell,
  BellDot,
  BellRing,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { authToken, profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [requestCount, setRequestCount] = useState();

  const fetchCountRequest = async () => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:8080/requests/count`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRequestCount(res.data || 0);
    } catch (error) {
    }
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const goToProfile = () => {
    navigate("/admin/profile");
  };

  const goToRequest = () => {
    navigate("/admin/register-request");
  };

  useEffect(() => {
    fetchCountRequest();
  }, [authToken]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>
      <div className="flex">
        <button
          className="relative p-4 hover:bg-gray-100 transition-colors duration-600 rounded-2xl mr-5"
          title="View Requests"
          onClick={goToRequest}
        >
          <BellRing className="w-5 h-5 text-slate-700" />
          {requestCount >= 0 && (
            <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {requestCount > 99 ? '99+' : requestCount}
            </span>
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full flex items-center justify-center">
              {profileData.image ? (
                <img
                  src={`${profileData.image}`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <span className="text-gray-800 font-medium">
              {profileData.userName ? profileData.userName : "Admin"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              <button
                onClick={goToProfile}
                className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-3 text-gray-500" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 mr-3 text-gray-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
