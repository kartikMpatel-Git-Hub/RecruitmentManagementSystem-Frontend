import { Users, Trash2, Check } from "lucide-react";

function RegisterRequestList({ requests, acceptRequest, rejectRequest }) {
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
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  User Request Management
                </h1>
                <p className="text-gray-600 text-lg">
                  View and manage all Requested requests
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Requests Found
            </h3>
            <p className="text-gray-600 text-lg">
              There are no registration requests at the moment.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Id
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  UserName
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((request) => {
                const { registerId, userName, userEmail, role, userImageUrl } =
                  request;

                return (
                  <tr
                    key={registerId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                          #{registerId}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10">
                        {userImageUrl ? (
                          <img
                            src={userImageUrl}
                            alt="User"
                            className="w-full h-full rounded-full object-cover border-2 border-slate-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {userName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{userEmail}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleClasses(
                          role
                        )}`}
                      >
                        {role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => acceptRequest(registerId)}
                          className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="Accept Request"
                        >
                          <Check className="w-4 h-4" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Accept Request
                          </span>
                        </button>
                        <button
                          onClick={() => rejectRequest(registerId)}
                          className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="Reject Request"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Reject Request
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RegisterRequestList;
