import React, { useState } from "react";
import RoundAddModal from "./AddRoundModal";
import RoundEditModal from "./EditRoundModal";
import RoundPassModal from "./PassRoundModal";
import Interview from "./interviews/InterviewSection";
import axios from "axios";
import { toast } from "react-toastify";

function Round({ app, fetchShortlistedApplications, openHoldStatus, authToken, userType }) {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [passModal, setPassModal] = useState(null);

  // ----------------------------
  // ACTION PERMISSIONS
  // ----------------------------
  const allowedUser = () =>
    (userType === "admin" || userType === "recruiter") &&
    app.applicationStatus.applicationStatus !== "REJECTED";

  const isRoundCompleted = (round) => {
    const now = new Date();

    const rd = Array.isArray(round.roundDate)
      ? new Date(round.roundDate[0], round.roundDate[1] - 1, round.roundDate[2])
      : new Date(round.roundDate);

    const rt = Array.isArray(round.roundExpectedTime)
      ? new Date(rd.getFullYear(), rd.getMonth(), rd.getDate(), round.roundExpectedTime[0], round.roundExpectedTime[1])
      : new Date(`${rd.toDateString()} ${round.roundExpectedTime}`);

    const end = new Date(rt.getTime() + round.roundDurationInMinutes * 60000);

    return now > end;
  };

  // ----------------------------
  // API HANDLERS
  // ----------------------------

  const addRound = async (data) => {
    try {
      await axios.post(
        `http://localhost:8080/rounds/applications/${app.applicationId}`,
        data,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Round added successfully!");
      setAddModal(false);
      fetchShortlistedApplications();
    } catch (err) {
      toast.error("Failed to add round");
    }
  };

  const updateRound = async (roundId, updated) => {
    try {
      await axios.put(
        `http://localhost:8080/rounds/${roundId}`,
        updated,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Round updated successfully!");
      setEditModal(null);
      fetchShortlistedApplications();
    } catch (err) {
      toast.error("Failed to update round");
    }
  };

  const deleteRound = async (roundId) => {
    if (!window.confirm("Delete this round?")) return;
    try {
      await axios.delete(`http://localhost:8080/rounds/${roundId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Round deleted");
      fetchShortlistedApplications();
    } catch (err) {
      toast.error("Failed to delete round");
    }
  };

  const passRound = async (roundId, body) => {
    try {
      await axios.put(
        `http://localhost:8080/rounds/pass/${roundId}`,
        body,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Round result submitted!");
      setPassModal(null);
      fetchShortlistedApplications();
    } catch (err) {
      toast.error("Failed to submit result");
    }
  };

  return (
    <>
      <tr>
        <td colSpan="6" className="px-6 py-4 bg-gray-50">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => openHoldStatus(app.applicationId)}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl"
            >
              {app.applicationStatus.applicationStatus === "ONHOLD"
                ? "Unhold"
                : "Hold"}{" "}
              Application
            </button>
          </div>

          <div className="space-y-3">
            {app.applicationRounds.length > 0 ? (
              <>
                <h4 className="text-lg font-semibold">Rounds</h4>

                {app.applicationRounds
                  .sort((a, b) => a.roundSequence - b.roundSequence)
                  .map((round) => (
                    <div key={round.roundId} className="bg-white p-4 rounded-lg shadow">
                      {/* Round Info Block */}
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-slate-800 text-white rounded-full flex items-center justify-center">
                              {round.roundSequence}
                            </div>

                            <strong>{round.roundType.replace("_", " ")}</strong>

                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                round.roundResult === "PASS"
                                  ? "bg-green-100 text-green-800"
                                  : round.roundResult === "FAIL"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {round.roundResult}
                            </span>
                          </div>

                          <p className="text-sm mt-2">
                            Date:{" "}
                            {Array.isArray(round.roundDate)
                              ? `${round.roundDate[2]}/${round.roundDate[1]}/${round.roundDate[0]}`
                              : round.roundDate || "Not Set"}
                          </p>

                          <p className="text-sm">
                            Time:{" "}
                            {Array.isArray(round.roundExpectedTime)
                              ? `${round.roundExpectedTime[0]}:${String(
                                  round.roundExpectedTime[1]
                                ).padStart(2, "0")}`
                              : round.roundExpectedTime || "Not Set"}
                          </p>
                        </div>

                        {/* Controls */}
                        {allowedUser() && (
                          <div className="flex items-center gap-3">
                            {/* Give Result */}
                            {round.roundResult === "PENDING" &&
                              isRoundCompleted(round) && (
                                <button
                                  className="px-3 py-1 bg-green-600 text-white rounded"
                                  onClick={() => setPassModal(round)}
                                >
                                  Result
                                </button>
                              )}

                            {/* Edit */}
                            {!isRoundCompleted(round) && (
                              <button
                                className="p-2 text-blue-600"
                                onClick={() => setEditModal(round)}
                              >
                                ✎
                              </button>
                            )}

                            {/* Delete */}
                            {!isRoundCompleted(round) && (
                              <button
                                className="p-2 text-red-600"
                                onClick={() => deleteRound(round.roundId)}
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Inject Interview Component */}
                      {(round.roundType === "TECHNICAL" ||
                        round.roundType === "HR") && (
                        <Interview
                          round={round}
                          app={app}
                          authToken={authToken}
                          userType={userType}
                        />
                      )}
                    </div>
                  ))}

                {allowedUser() && (
                  <button
                    className="w-full bg-gray-100 border-dashed rounded-xl p-3 mt-3"
                    onClick={() => setAddModal(true)}
                  >
                    + Add New Round
                  </button>
                )}
              </>
            ) : (
              <div>No rounds found</div>
            )}
          </div>
        </td>
      </tr>

      {/* MODALS */}
      {addModal && (
        <RoundAddModal
          visible={addModal}
          onClose={() => setAddModal(false)}
          onSubmit={addRound}
          nextSequence={app.applicationRounds.length + 1}
        />
      )}

      {editModal && (
        <RoundEditModal
          round={editModal}
          visible={true}
          onClose={() => setEditModal(null)}
          onSubmit={updateRound}
        />
      )}

      {passModal && (
        <RoundPassModal
          round={passModal}
          visible={true}
          onClose={() => setPassModal(null)}
          onSubmit={passRound}
        />
      )}
    </>
  );
}

export default Round;
