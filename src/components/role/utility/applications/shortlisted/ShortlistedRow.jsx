// src/components/Applications/shortlisted/ShortlistRow.jsx
import React from "react";
import { Eye, ChevronDown, Clock } from "lucide-react";
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

        <td className="px-6 py-4 text-center">
          <div className="flex justify-center">
            <button
              onClick={() => openPositionModal(app?.positionId)}
              className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
            >
              <Eye className="w-4 h-4" />
              View Position
            </button>

            <button
              onClick={() => openProfileModal(app?.candidateId)}
              className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </button>

            <button
              onClick={onToggle}
              className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
            >
              <Clock className="w-4 h-4" />
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
              Rounds
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
