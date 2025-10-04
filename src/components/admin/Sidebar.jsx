import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col min-h-screen overflow-y-auto">
      <div className="p-4 text-2xl font-bold text-center border-b border-gray-700">
        <button
          onClick={() => navigate("/admin/")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
        >
        Admin Dashboard
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-4 h-full">
        <button
          onClick={() => navigate("/admin/users")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Manage Users
        </button>
         <button
          onClick={() => navigate("/admin/skills")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Manage Skills
        </button>
        {/*<button
          onClick={() => navigate("/admin/view-reports")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
        >
          View Reports
        </button> */}
        <button
          onClick={() => navigate("/admin/degrees")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Manage Degrees
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;