import { useNavigate } from "react-router-dom";
import {
  Users,
  Award,
  GraduationCap,
  Building2,
  LayoutDashboard,
  Briefcase,
  MailsIcon,
  BookmarkIcon,
  CheckCircle,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col min-h-screen overflow-y-auto">
      <div className="p-6 border-b border-slate-700">
        <button
          onClick={() => navigate("/hr/")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xl font-bold">Dashboard</span>
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => navigate("/hr/candidates")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Users className="w-5 h-5" />
          <span>Manage Candidates</span>
        </button>
        <button
          onClick={() => navigate("/hr/skills")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Award className="w-5 h-5" />
          <span>Manage Skills</span>
        </button>
        <button
          onClick={() => navigate("/hr/degrees")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Manage Degrees</span>
        </button>
        <button
          onClick={() => navigate("/hr/universities")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Building2 className="w-5 h-5" />
          <span>Manage Universities</span>
        </button>
        <button
          onClick={() => navigate("/hr/positions")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <Briefcase className="w-5 h-5" />
          <span>Manage Positions</span>
        </button>
        <button
          onClick={() => navigate("/hr/applications")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <MailsIcon className="w-5 h-5" />
          <span>View Applications</span>
        </button>
        <button
          onClick={() => navigate("/hr/applications/shortlists")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <BookmarkIcon className="w-5 h-5" />
          <span>View Shortlists</span>
        </button>
        <button
          onClick={() => navigate("/hr/document-verification")}
          className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-xl hover:bg-slate-700 transition-colors duration-200"
        >
          <CheckCircle className="w-5 h-5" />
          <span>View Document Verification</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
