import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, ArrowLeft, Download, Star, Clock, Globe, GraduationCap } from "lucide-react";
import axios from "axios";

function CandidateProfileDisplay() {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [allEducations, setAllEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getUserEducations = async () => {
    if (!user.candidateId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/candidate-educations/candidate/${user.candidateId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setAllEducations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching educations:", error);
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return 'N/A';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  useEffect(() => {
    if (authToken) {
      getUserProfile();
    } else {
      logout();
      navigate("/login");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    if (user.candidateId) {
      getUserEducations();
      setLoading(false);
    }
  }, [user.candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
          <div className="text-slate-600 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/candidate")}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-white/50 px-3 py-2 rounded-lg transition-all duration-200 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse opacity-20"></div>
              <img
                src={user.userImageUrl || '/default-avatar.png'}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center z-20">
                <Star className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                {user.candidateFirstName} {user.candidateMiddleName} {user.candidateLastName}
              </h2>
              <p className="text-slate-500 mb-6 text-lg">@{user.userName}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{user.userEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">{user.candidatePhoneNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">{formatDate(user.candidateDateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="font-medium">{user.candidateGender}</span>
                </div>
              </div>
            </div>

            {user.candidateResumeUrl && (
              <div className="flex-shrink-0">
                <a
                  href={user.candidateResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-semibold">Download Resume</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Address Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-red-100 to-pink-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Address</h3>
            </div>
            <div className="space-y-3 text-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <p className="font-medium">{user.candidateAddress}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <p className="font-medium">{user.candidateCity}, {user.candidateState}</p>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500" />
                <p className="font-medium">{user.candidateCountry} - {user.candidateZipCode}</p>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Experience</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {user.candidateTotalExperienceInYears || 0}
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className="text-lg font-semibold">
                  {user.candidateTotalExperienceInYears === 1 ? 'Year' : 'Years'} of Experience
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {user.candidateSkills && user.candidateSkills.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Skills & Expertise</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {user.candidateSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-blue-100 hover:to-indigo-100 text-slate-700 hover:text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-default"
                >
                  {skill.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {allEducations && allEducations.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Education</h3>
            </div>
            <div className="space-y-4">
              {allEducations.map((education, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1">Degree</h4>
                      <p className="text-slate-800 font-medium">{education.degreeName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1">University</h4>
                      <p className="text-slate-800 font-medium">{education.universityName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1">Percentage</h4>
                      <p className="text-slate-800 font-medium">{education.percentage}%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600 mb-1">Passing Year</h4>
                      <p className="text-slate-800 font-medium">{education.passingYear}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateProfileDisplay;