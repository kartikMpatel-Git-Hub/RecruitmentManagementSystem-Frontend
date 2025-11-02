import { Users, Trash2, Power, PowerOff,Eye } from "lucide-react";

function UserList({ users, onUpdate, onDelete, onView}) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600 text-lg">View and manage all system users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Users Found</h3>
            <p className="text-gray-600 text-lg">There are no users in the system at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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
                  className="bg-white rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt="User"
                        className="w-full h-full rounded-full object-cover border-4 border-slate-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-1">{userEmail}</p>

                  <div className="flex flex-col items-center space-y-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                        role.role
                      )}`}
                    >
                      {role.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userEnabled ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={()=>onView(userId)}
                      className="flex items-center justify-center w-full px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2"/>
                      <span className="text-xs">View</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdate(!userEnabled, userId)}
                        className={`flex items-center justify-center flex-1 px-3 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                          userEnabled
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {userEnabled ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDelete(userId)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
