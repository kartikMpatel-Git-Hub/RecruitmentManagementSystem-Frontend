import React, { useState } from "react";
import { Eye,Briefcase, ChevronDown, Clock, User } from "lucide-react";
import Round from "./Round";

function Shortlists({
  shortlistedApplications,
  getStatusBadge,
  openPositionModal,
  openProfileModal,
  openHoldStatus,
  fetchShortlistedApplications,
}) {
  const [expandedRounds, setExpandedRounds] = useState({});

  const toggleRounds = (applicationId) => {
    setExpandedRounds((prev) => ({
      ...prev,
      [applicationId]: !prev[applicationId],
    }));
  };
  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Index
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Application ID
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
            {shortlistedApplications.map((app, index) => (
              <React.Fragment key={app.applicationId}>
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
                    <span className="text-gray-900 font-medium">
                      {app?.applicationId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {app?.candidateId}
                    </span>
                  </td>
                  <td 
                  className="px-6 py-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        app.applicationStatus?.applicationStatus
                      )}`}
                    >
                      {app.applicationStatus?.applicationStatus || "Unknown"}
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
                  <td className="flex px-6 py-4 text-center">
                    <button
                      onClick={() => openPositionModal(app?.positionId)}
                      className="m-1 inline-flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
                      title="view Position"
                    >
                      <Briefcase className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openProfileModal(app?.candidateId)}
                      className="m-1 inline-flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
                      title="view Candidate"
                    >
                      <User className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleRounds(app.applicationId)}
                      className="m-1 inline-flex items-center gap-2 px-2 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
                      title="Toggle Rounds"
                    >
                      <Clock className="w-4 h-4" />
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedRounds[app.applicationId] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </td>
                </tr>
                {expandedRounds[app.applicationId] && (
                  <Round
                    app={app}
                    openHoldStatus={openHoldStatus}
                    fetchShortlistedApplications={fetchShortlistedApplications}
                  />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Shortlists;
