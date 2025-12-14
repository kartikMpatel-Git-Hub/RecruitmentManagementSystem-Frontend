// src/components/Applications/shortlisted/ShortlistRow.jsx
import React from "react";
import { Eye, ChevronDown, Clock, Briefcase, User } from "lucide-react";
import RoundSection from "./rounds/RoundSection";

function ShortlistRow({
  index,
  app,
  isExpanded,
  onToggle,
  getStatusBadge,
  openPositionModal,
  openProfileModal,
  openHoldStatus,
  fetchShortlistedApplications,
}) {
  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <span className="font-semibold text-gray-900">#{index + 1}</span>
        </td>

        <td className="px-6 py-4">
          <span className="text-gray-900 font-medium">{app?.applicationId}</span>
        </td>

        <td className="px-6 py-4">
          <span className="text-gray-900 font-medium">{app?.candidateId}</span>
        </td>

        <td className="px-6 py-4">
          <span className="text-gray-900 font-medium">{app?.positionId}</span>
        </td>

        <td className="px-6 py-4">
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
              <span className="text-sm text-gray-400">No feedback</span>
            )}
          </div>
        </td>

        <td className="px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => openPositionModal(app?.positionId)}
              className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              title="View Position"
            >
              <Briefcase className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Position
              </span>
            </button>

            <button
              onClick={() => openProfileModal(app?.candidateId)}
              className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              title="View Profile"
            >
              <User className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Profile
              </span>
            </button>

            <button
              onClick={onToggle}
              className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              title="Toggle Rounds"
            >
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isExpanded ? "Hide Rounds" : "Show Rounds"}
              </span>
            </button>
          </div>
        </td>
      </tr>

      {isExpanded && (
        <RoundSection
          app={app}
          openHoldStatus={openHoldStatus}
          fetchShortlistedApplications={fetchShortlistedApplications}
        />
      )}
    </>
  );
}

export default ShortlistRow;
