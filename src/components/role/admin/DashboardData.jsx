import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Award, Building2, ArrowRight } from "lucide-react";

function DashboardData({ candidates,users, degrees, skills ,universities}) {
  const navigate = useNavigate();

  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "hr":
        return "bg-blue-100 text-blue-700";
      case "recruiter":
        return "bg-yellow-100 text-yellow-700";
      case "employee":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Admin!</h1>
        <p className="text-gray-600">Manage your system resources and users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{candidates.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Degrees</p>
              <p className="text-3xl font-bold text-gray-900">{degrees.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900">{skills.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Universities</p>
              <p className="text-3xl font-bold text-gray-900">{universities.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Users</h2>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
            onClick={() => navigate("/admin/users")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No users found.</p>
        ) : (
          <div className="grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-8 gap-6">
            {users.slice(0, 6).map((user) => {
              const {
                userId,
                userName,
                userEmail,
                role,
                userImageUrl,
                userEnabled,
              } = user;

              return (
                <div
                  key={userId}
                  className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt={userName}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{userEmail}</p>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                        role.role
                      )}`}
                    >
                      {role.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Candidates</h2>
          </div>
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors duration-200"
            onClick={() => navigate("/admin/candidates")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No Candidate found.</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-6">
            {candidates.slice(0, 6).map((candidate) => {
              const {
                userId,
                userName,
                userEmail,
                role,
                userImageUrl,
                userEnabled,
              } = candidate;

              return (
                <div
                  key={userId}
                  className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-16 h-16 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt={userName}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{userEmail}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Degrees Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Degrees</h3>
            </div>
            <button
              className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200"
              onClick={() => navigate("/admin/degrees")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {degrees.slice(0, 3).map((degree) => (
              <div key={degree.degreeId} className="bg-gray-50 p-3 rounded-xl">
                <p className="font-medium text-gray-900">{degree.degree}</p>
                <p className="text-gray-600 text-sm">{degree.stream}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Skills</h3>
            </div>
            <button
              className="flex items-center space-x-1 px-3 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200"
              onClick={() => navigate("/admin/skills")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 6).map((skill) => (
              <span
                key={skill.skillId}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {skill.skill}
              </span>
            ))}
          </div>
        </div>

        {/* Universities Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Universities</h3>
            </div>
            <button
              className="flex items-center space-x-1 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors duration-200"
              onClick={() => navigate("/admin/universities")}
            >
              <span className="text-sm">View</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {universities.slice(0, 3).map((university) => (
              <div key={university.universityId} className="bg-gray-50 p-3 rounded-xl">
                <p className="font-medium text-gray-900">{university.university}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardData;
