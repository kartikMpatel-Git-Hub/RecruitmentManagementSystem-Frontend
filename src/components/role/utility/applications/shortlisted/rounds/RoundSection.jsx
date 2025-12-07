// src/components/Applications/shortlisted/RoundSection/RoundSection.jsx
import React, { useContext, useState, useMemo } from "react";
import { Clock, Info, Star, Calendar, MessageSquare } from "lucide-react";
import { BiStopwatch } from "react-icons/bi";
import { AuthContext } from "../../../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

import AddRoundModal from "./AddRoundModal";
import EditRoundModal from "./EditRoundModal";
import PassRoundModal from "./PassRoundModal";
import InterviewSection from "./interviews/InterviewSection";

function RoundSection({ app, fetchShortlistedApplications, openHoldStatus }) {
  const { authToken, userType } = useContext(AuthContext);

  const [editingRound, setEditingRound] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPassForm, setShowPassForm] = useState(false);
  const [passingRoundId, setPassingRoundId] = useState(null);

  const [passFormData, setPassFormData] = useState({
    roundResult: "PASS",
    roundFeedback: "",
    roundRating: "",
  });

  const [newRound, setNewRound] = useState({
    roundType: "",
    roundSequence: app.applicationRounds?.length + 1 || 1,
    roundDate: "",
    roundExpectedTime: "",
    roundDurationInMinutes: "",
  });

  const roundTypes = useMemo(
    () => ["APTITUDE", "GROUP_DISCUSSION", "CODING", "TECHNICAL", "HR", "CEO"],
    []
  );

  const allowAccess = () => {
    if (app.applicationStatus.applicationStatus === "REJECTED") return false;
    return true;
  };

  const allowedUser = () =>
    allowAccess() && (userType === "admin" || userType === "recruiter");

  const handleEditRound = (round) => setEditingRound({ ...round });
  const closeEditModal = () => setEditingRound(null);

  const isRoundCompleted = (round) => {
    if (round.roundStatus?.roundStatus === "COMPLETED") return true;

    if (!round.roundDate || !round.roundExpectedTime || !round.roundDurationInMinutes)
      return false;

    const now = new Date();
    const roundDate = Array.isArray(round.roundDate)
      ? new Date(round.roundDate[0], round.roundDate[1] - 1, round.roundDate[2])
      : new Date(round.roundDate);

    const roundTime = Array.isArray(round.roundExpectedTime)
      ? new Date(
          roundDate.getFullYear(),
          roundDate.getMonth(),
          roundDate.getDate(),
          round.roundExpectedTime[0],
          round.roundExpectedTime[1]
        )
      : new Date(`${roundDate.toDateString()} ${round.roundExpectedTime}`);

    const roundEndTime = new Date(
      roundTime.getTime() + round.roundDurationInMinutes * 60000
    );

    return now > roundEndTime;
  };

  const handleSaveRound = async (roundId) => {
    if (!editingRound) return;

    const requestBody = {
      roundSequence: editingRound.roundSequence,
      roundExpectedDate: editingRound.roundDate,
      roundExpectedTime: editingRound.roundExpectedTime,
      roundDurationInMinutes: editingRound.roundDurationInMinutes,
      roundStatus: {
        roundFeedback: editingRound.roundStatus?.roundFeedback || "",
      },
    };

    try {
      await axios.put(`http://localhost:8080/rounds/${roundId}`, requestBody, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Round updated successfully!");
      fetchShortlistedApplications();
      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update round");
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (!window.confirm("Delete this round?")) return;

    try {
      await axios.delete(`http://localhost:8080/rounds/${roundId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Round deleted successfully!");
      fetchShortlistedApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete round");
    }
  };

  const openPassForm = (roundId) => {
    setPassingRoundId(roundId);
    setShowPassForm(true);
  };

  const handlePassRound = async () => {
    try {
      await axios.put(
        `http://localhost:8080/rounds/pass/${passingRoundId}`,
        {
          roundResult: passFormData.roundResult,
          roundFeedback: passFormData.roundFeedback,
          roundRating: parseFloat(passFormData.roundRating) || null,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Result Given!");
      setShowPassForm(false);
      setPassFormData({
        roundResult: "PASS",
        roundFeedback: "",
        roundRating: "",
      });
      fetchShortlistedApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update round result");
    }
  };

  const handleAddRound = async () => {
    if (!authToken) return;

    if (!newRound.roundType) return toast.error("Please select a round type");
    if (!newRound.roundSequence || newRound.roundSequence < 1)
      return toast.error("Enter a valid sequence");

    try {
      await axios.post(
        `http://localhost:8080/rounds/applications/${app.applicationId}`,
        newRound,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Round added successfully!");
      setShowAddForm(false);
      fetchShortlistedApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add round");
    }
  };

  const canModifyRounds =
    allowedUser() && app.applicationStatus?.applicationStatus !== "REJECTED";

  return (
    <>
      <tr>
        <td colSpan="6" className="px-6 py-4 bg-gray-50">
          <div className="flex justify-end mb-3">
            <button
              onClick={() => openHoldStatus(app.applicationId)}
              className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-slate-900 transition-colors"
            >
              {app.applicationStatus.applicationStatus === "ONHOLD"
                ? "Unhold"
                : "Hold"}{" "}
              Application
            </button>
          </div>

          {app.applicationRounds?.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Application Rounds ({app.applicationRounds.length})
              </h4>

              <div className="space-y-3">
                {app.applicationRounds
                  .slice()
                  .sort((a, b) => a.roundSequence - b.roundSequence)
                  .map((round) => (
                    <React.Fragment key={round.roundId}>
                      <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex gap-4 items-center mb-2">
                            <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs">
                              {round.roundSequence}
                            </div>

                            <div className="font-semibold text-gray-900">
                              {round.roundType.replace("_", " ")}
                            </div>

                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                round.roundResult === "PASS"
                                  ? "bg-green-100 text-green-800"
                                  : round.roundResult === "FAIL"
                                  ? "bg-red-100 text-red-800"
                                  : round.roundResult === "UNDERVALUATION"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {round.roundResult}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="text-gray-600">Date:</span>
                              <span>
                                {Array.isArray(round.roundDate)
                                  ? `${round.roundDate[2]}/${round.roundDate[1]}/${round.roundDate[0]}`
                                  : round.roundDate || "Not Set"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-gray-600">Time:</span>
                              <span>
                                {Array.isArray(round.roundExpectedTime)
                                  ? `${String(
                                      round.roundExpectedTime[0]
                                    ).padStart(2, "0")}:${String(
                                      round.roundExpectedTime[1]
                                    ).padStart(2, "0")}`
                                  : round.roundExpectedTime || "Not Set"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <BiStopwatch className="w-4 h-4" />
                              <span className="text-gray-600">Duration:</span>
                              <span>
                                {round.roundDurationInMinutes
                                  ? `${round.roundDurationInMinutes} Minutes`
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              <span className="text-gray-600">Rating:</span>
                              <span>
                                {round.roundRating
                                  ? `${round.roundRating}/5`
                                  : "Not Rated"}
                              </span>
                            </div>
                          </div>

                          {(round.roundStatus?.roundFeedback ||
                            round.roundFeedback) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Round Feedback:
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                {round.roundFeedback ||
                                  round.roundStatus?.roundFeedback}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right side actions & stars */}
                        <div className="flex flex-col items-end justify-between gap-2">
                          {canModifyRounds && (
                            <div className="flex items-center gap-3">
                              {round.roundResult === "PENDING" &&
                                isRoundCompleted(round) && (
                                  <button
                                    onClick={() => openPassForm(round.roundId)}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700"
                                  >
                                    Give Result
                                  </button>
                                )}

                              {!isRoundCompleted(round) && (
                                <>
                                  <button
                                    onClick={() => handleEditRound(round)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteRound(round.roundId)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          )}

                          {round.roundResult !== "PENDING" && (
                            <div className="flex items-center gap-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 fill-current ${
                                      i < (round.roundRating || 0)
                                        ? ""
                                        : "opacity-30"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({round.roundRating || 0}/5)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {(round.roundType === "TECHNICAL" ||
                        round.roundType === "HR") && (
                        <InterviewSection app={app} round={round} />
                      )}
                    </React.Fragment>
                  ))}

                {canModifyRounds && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="w-full bg-gray-100 border-dashed border border-gray-300 rounded-xl p-3 mt-3 text-sm text-gray-700 hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">+</span>
                    Add New Round
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-600">
              <Info className="w-5 h-5 inline-block mr-2" />
              No Round Specified For This Application
            </div>
          )}
        </td>
      </tr>

      {/* Modals */}
      <AddRoundModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        newRound={newRound}
        setNewRound={setNewRound}
        maxSequence={(app.applicationRounds?.length || 0) + 1}
        roundTypes={roundTypes}
        onSubmit={handleAddRound}
      />

      <EditRoundModal
        editingRound={editingRound}
        onClose={closeEditModal}
        onSave={handleSaveRound}
        maxSequence={app.applicationRounds?.length || 1}
      />

      <PassRoundModal
        isOpen={showPassForm}
        onClose={() => setShowPassForm(false)}
        passFormData={passFormData}
        setPassFormData={setPassFormData}
        onSubmit={handlePassRound}
      />
    </>
  );
}

export default RoundSection;
