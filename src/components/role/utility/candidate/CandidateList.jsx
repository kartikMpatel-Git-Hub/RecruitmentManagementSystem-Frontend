import { Users, Trash2, Power, PowerOff, Eye } from "lucide-react";

function CandidateList({ candidates, onUpdate, onDelete ,onView}) {
  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Candidates</h1>
        </div>
        <p className="text-gray-600">View and manage all system Candidates</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No candidates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {candidates.map((candidate) => {
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
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt="User"
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{userEmail}</p>

                  <div className="flex items-center space-x-2 mb-4">
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

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={()=>onView(userId)}
                      className="bg-neutral-600 px-2 py-2 rounded-2xl"
                    >
                      <Eye className="text-white"/>
                    </button>
                    <button
                      onClick={() => onUpdate(!userEnabled, userId)}
                      className={`flex items-center justify-center flex-1 px-3 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                        userEnabled
                          ? "bg-orange-500 hover:bg-orange-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {userEnabled ? <PowerOff className="w-4 h-4 mr-1" /> : <Power className="w-4 h-4 mr-1" />}
                      <span className="text-xs">{userEnabled ? "Disable" : "Enable"}</span>
                    </button>
                    <button
                      onClick={() => onDelete(userId)}
                      className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default CandidateList;
