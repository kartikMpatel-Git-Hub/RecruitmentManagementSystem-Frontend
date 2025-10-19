import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardData({ users, degrees, skills }) {
  const navigate = useNavigate();

  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "hr":
        return "bg-blue-100 text-blue-700";
      case "manager":
        return "bg-yellow-100 text-yellow-700";
      case "employee":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, Admin!</h2>

      {/* Users Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">All Users</h2>
          <p className="text-gray-600">Total Users: {users.length}</p>
          <button
            className="text-blue-500 hover:text-red-500"
            onClick={() => navigate("/admin/users")}
          >
            View All
          </button>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => {
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
                  className="bg-gray-50 rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt={userName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-300">
                        <span className="text-gray-700 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-800">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm">{userEmail}</p>

                  {/* Role Badges */}
                  <div className="mt-2 flex gap-2 flex-wrap justify-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleClasses(
                        role.role
                      )}`}
                    >
                      {role.role}
                    </span>
                  </div>

                  {/* Active/Inactive */}
                  <p
                    className={`mt-2 text-sm font-bold px-3 py-1 rounded-full ${
                      userEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {userEnabled ? "Active" : "Inactive"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Degrees Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">All Degrees</h2>
          <p className="text-gray-600">Total Degrees: {degrees.length}</p>
          <button
            className="text-blue-500 hover:text-red-500"
            onClick={() => navigate("/admin/degrees")}
          >
            View All
          </button>
        </div>

        {degrees.length === 0 ? (
          <p className="text-gray-500 text-center">No degrees available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {degrees.map((degree) => (
              <div
                key={degree.degreeId}
                className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col items-center hover:shadow-md transition"
              >
                <span className="text-gray-800 font-medium">
                  {degree.degree}
                </span>
                <span className="text-gray-500 text-sm">{degree.stream}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">All Skills</h2>
          <p className="text-gray-600">Total Skills: {skills.length}</p>
          <button
            className="text-blue-500 hover:text-red-500"
            onClick={() => navigate("/admin/skills")}
          >
            View All
          </button>
        </div>

        {skills.length === 0 ? (
          <p className="text-gray-500 text-center">No skills available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center justify-center hover:shadow-md transition"
              >
                <span className="text-gray-800 font-medium">{skill.skill}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default DashboardData;
