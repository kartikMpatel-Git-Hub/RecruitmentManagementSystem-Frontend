import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Award, GraduationCap, Building2, LayoutDashboard } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col min-h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <button
          onClick={() => navigate("/admin/")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xl font-bold">Dashboard</span>
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Users className="w-5 h-5" />
          <span>Manage Users</span>
        </button>
        <button
          onClick={() => navigate("/admin/candidates")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Users className="w-5 h-5" />
          <span>Manage Candidates</span>
        </button>
        <button
          onClick={() => navigate("/admin/skills")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Award className="w-5 h-5" />
          <span>Manage Skills</span>
        </button>
        <button
          onClick={() => navigate("/admin/degrees")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Manage Degrees</span>
        </button>
        <button
          onClick={() => navigate("/admin/universities")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Building2 className="w-5 h-5" />
          <span>Manage Universities</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;