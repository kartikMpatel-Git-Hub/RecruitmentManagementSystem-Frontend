// src/components/Applications/shortlisted/ShortlistTable.jsx
import React, { useState } from "react";
import ShortlistRow from "./ShortlistedRow";

function ShortlistTable({
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
              PositionId ID
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
            <ShortlistRow
              key={app.applicationId}
              index={index}
              app={app}
              isExpanded={!!expandedRounds[app.applicationId]}
              onToggle={() => toggleRounds(app.applicationId)}
              getStatusBadge={getStatusBadge}
              openPositionModal={openPositionModal}
              openProfileModal={openProfileModal}
              openHoldStatus={openHoldStatus}
              fetchShortlistedApplications={fetchShortlistedApplications}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShortlistTable;
