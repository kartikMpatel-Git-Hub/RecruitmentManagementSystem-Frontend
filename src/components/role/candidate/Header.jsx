import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, User, LogOut, ArrowLeft } from "lucide-react";

const Header = ({ title, showBackButton = false, backPath = "/candidate/home" }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={() => navigate(backPath)}
                className="p-2 text-gray-700 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 rounded-lg">
              <Briefcase className="w-6 h-6 text-gray-900" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/candidate/positions")}
              className="px-4 py-2 text-gray-700 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-all font-medium"
            >
              Positions
            </button>
            <button
              onClick={() => navigate("/candidate/profile")}
              className="p-2 text-gray-700 hover:text-slate-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/logout")}
              className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;