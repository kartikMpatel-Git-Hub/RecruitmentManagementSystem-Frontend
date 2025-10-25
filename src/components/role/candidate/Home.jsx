import React, { use, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import { LogOut, User, Home as HomeIcon } from "lucide-react";

function Home() {

    const { authToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const logoutHandler = () => {
        navigate("/logout");
    }

    const profilePageGoto = ()=>{
        navigate("/candidate/profile");
    }

    useEffect(() => {
        if (!authToken) {
            navigate("/login");
        }
    }, []);

    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
                    <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Home
                </h1>
                <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                <div className="space-y-4">
                    <button 
                        onClick={profilePageGoto} 
                        className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-2xl hover:from-slate-900 hover:to-black focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    >
                        <User className="w-5 h-5 mr-3" />
                        View Profile
                    </button>
                    
                    <button 
                        onClick={logoutHandler} 
                        className="flex items-center justify-center w-full px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Home;
