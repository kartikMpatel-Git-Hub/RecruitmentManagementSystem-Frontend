function UserList({ users, onUpdate, onDelete }) {
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
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Users</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
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
                  className="bg-gray-100 rounded-lg shadow-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt="User"
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

                  <p className="mt-2 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleClasses(
                            role.role
                          )}`}
                        >
                          {role.role}
                        </span>
                  </p>

                  <p
                    className={`mt-2 text-sm font-bold px-3 py-1 rounded-full ${
                      userEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {userEnabled ? "Active" : "Inactive"}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => onDelete(userId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => onUpdate(!userEnabled, userId)}
                      className={`text-white px-4 py-1 rounded-md transition ${
                        userEnabled
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {userEnabled ? "Deactivate" : "Activate"}
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

export default UserList;
