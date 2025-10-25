import { useState ,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

function Header() {
  const { profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate("/logout");
  };

  const goToProfile = () => {
    navigate("/recruiter/profile");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
        Recruiter Dashboard
      </h1>
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full flex items-center justify-center">
            {/* <User className="w-4 h-4 text-white" /> */}
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
    </header>
  );
}

export default Header;
