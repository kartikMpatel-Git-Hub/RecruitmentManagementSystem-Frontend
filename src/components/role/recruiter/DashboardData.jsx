import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Award, Building2, ArrowRight } from "lucide-react";

function DashboardData({ candidates, degrees, skills ,universities}) {
  const navigate = useNavigate();

  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-slate-100 text-slate-800";
      case "hr":
        return "bg-slate-100 text-slate-800";
      case "recruiter":
        return "bg-slate-100 text-slate-800";
      case "employee":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back! Manage candidates and recruitment resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{candidates.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Degrees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{degrees.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{skills.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Universities</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{universities.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Section */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Candidates</h2>
          </div>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            onClick={() => navigate("/recruiter/candidates")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No candidates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {candidates.slice(0, 6).map((candidate) => {
              const {
                userId,
                userName,
                userEmail,
                userImageUrl,
              } = candidate;

              return (
                <div
                  key={userId}
                  className="bg-white rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt={userName}
                        className="w-full h-full rounded-full object-cover border-4 border-slate-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3 line-clamp-1">{userEmail}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Degrees Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Degrees</h3>
            </div>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium"
              onClick={() => navigate("/recruiter/degrees")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {degrees.slice(0, 3).map((degree) => (
              <div key={degree.degreeId} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <p className="font-semibold text-gray-900">{degree.degree}</p>
                <p className="text-gray-600 text-sm mt-1">{degree.stream}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skills</h3>
            </div>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium"
              onClick={() => navigate("/recruiter/skills")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill.skillId}
                className="px-3 py-2 bg-slate-100 text-slate-800 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-200 transition-colors"
              >
                {skill.skill}
              </span>
            ))}
          </div>
        </div>

        {/* Universities Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Universities</h3>
            </div>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium"
              onClick={() => navigate("/recruiter/universities")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {universities.slice(0, 3).map((university) => (
              <div key={university.universityId} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <p className="font-semibold text-gray-900">{university.university}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardData;
