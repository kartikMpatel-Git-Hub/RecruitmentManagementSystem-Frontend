import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Briefcase, TrendingUp, Users, User } from "lucide-react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";

function Home() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    "postitions" : 0,
    "candidates" : 0,
  })

  const logoutHandler = () => {
    navigate("/logout");
  };

  const profilePageGoto = () => {
    navigate("/candidate/profile");
  };

  const positionsPageGoto = () => {
    navigate("/candidate/positions");
  };

  const fetchPositions = async (page = 0, size = 1) => {
    if (!authToken) 
      return navigate("/login");
    try {
      const response = await axios.get(`http://localhost:8080/positions/count`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCounts(prev => ({...prev,"postitions" : response.data}))
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
    }
  };
  const fetchCandidates = async (page = 0, size = 1) => {
    if (!authToken) 
      return navigate("/login");
    try {
      const response = await axios.get(`http://localhost:8080/candidates/count`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCounts(prev => ({...prev,"candidates" : response.data}))
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    }
    fetchPositions();
    fetchCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header title="RecruitmentMS" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Career Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing opportunities and take the next step in your professional journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{counts.postitions}</h3>
            <p className="text-gray-600">Active Positions</p>
          </div>
          
          {/* <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Success Rate</p>
          </div> */}
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{counts.candidates}</h3>
            <p className="text-gray-600">Happy Candidates</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={positionsPageGoto}
              className="flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Briefcase className="w-6 h-6" />
              Browse Positions
            </button>
            
            <button
              onClick={profilePageGoto}
              className="flex items-center justify-center gap-3 px-8 py-6 border-2 border-slate-800 text-slate-800 font-semibold rounded-2xl hover:bg-slate-800 hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <User className="w-6 h-6" />
              Update Profile
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
