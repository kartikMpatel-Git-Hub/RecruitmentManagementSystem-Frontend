import React,{useState} from "react";
import { Eye, Edit, User, Briefcase } from "lucide-react";
function Applications({
  applications,
  getStatusBadge,
  openProfileModal,
  openPositionModal,
  handleShortlistApplication
}) {
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 text-lg">
            <span className="font-bold text-gray-900">
              {
                applications.filter(
                  (app) =>
                    !statusFilter ||
                    app.applicationStatus?.applicationStatus === statusFilter
                ).length
              }
            </span>{" "}
            application
            {applications.filter(
              (app) =>
                !statusFilter ||
                app.applicationStatus?.applicationStatus === statusFilter
            ).length !== 1
              ? "s"
              : ""}{" "}
            found
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Filter by Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white text-sm"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDERPROCESS">Under Process</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Index
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Application Id
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Candidate ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Feedback
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {applications
              .filter(
                (app) =>
                  !statusFilter ||
                  app.applicationStatus?.applicationStatus === statusFilter
              )
              .map((app, index) => (
                <tr
                  key={app.applicationId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {app.applicationId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {app.candidateId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        app.applicationStatus?.applicationStatus
                      )}`}
                    >
                      {app.applicationStatus?.applicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {app.applicationStatus?.applicationFeedback ? (
                        <p
                          className="text-sm text-gray-600 truncate"
                          title={app.applicationStatus.applicationFeedback}
                        >
                          {app.applicationStatus.applicationFeedback}
                        </p>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No feedback
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {openPositionModal && (
                        <button
                          onClick={() => openPositionModal(app.positionId)}
                          className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="View Position"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            View Position
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => openProfileModal(app.candidateId)}
                        className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="View Profile"
                      >
                        <User className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          View Profile
                        </span>
                      </button>
                      <button
                        disabled={app.isShortlisted}
                        onClick={() => handleShortlistApplication(app.applicationId)}
                        className={`group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ${
                          app.isShortlisted && "opacity-50 cursor-not-allowed"
                        }`}
                        title={app.isShortlisted ? "Already Shortlisted" : "Shortlist Candidate"}
                      >
                        {app.isShortlisted ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {app.isShortlisted ? "Already Shortlisted" : "Shortlist Candidate"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Applications;
