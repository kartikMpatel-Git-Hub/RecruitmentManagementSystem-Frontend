import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import {
  Clock,
  Info,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  Star,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Interview from "./Interview";
import { BiStopwatch } from "react-icons/bi";

function Round({ app, fetchShortlistedApplications, openHoldStatus }) {
  const { authToken, userType } = useContext(AuthContext);
  const navigator = useNavigate();

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
    roundSequence: app.applicationRounds.length + 1,
    roundDate: "",
    roundExpectedTime: "",
    roundDurationInMinutes: "",
  });

  const roundTypes = [
    "APTITUDE",
    "GROUP_DISCUSSION",
    "CODING",
    "TECHNICAL",
    "HR",
    "CEO",
  ];

  const allowAccess = () => {
    if (app.applicationStatus.applicationStatus === "REJECTED") return false;
    return true;
  };

  const allowedUser = () => {
    if (allowAccess() && (userType === "admin" || userType === "recruiter"))
      return true;
    return false;
  };

  const handleEditRound = (round) => setEditingRound({ ...round });
  const closeEditModal = () => setEditingRound(null);

  const handleSaveRound = async (roundId) => {
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
      toast.error("Failed to update round");
    }
  };

  const isRoundCompleted = (round) => {
    if (round.roundStatus?.roundStatus === "COMPLETED") 
      return true;
    console.log(round);
    
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

  const handleDeleteRound = async (roundId) => {
    if (!window.confirm("Delete this round?")) return;

    try {
      await axios.delete(`http://localhost:8080/rounds/${roundId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Round deleted successfully!");
      fetchShortlistedApplications();
    } catch (error) {
      toast.error("Failed to delete round");
    }
  };

  const openPassForm = (roundId) => {
    setPassingRoundId(roundId);
    setShowPassForm(true);
  };

  const handlePassRound = async () => {
    try {
      console.log(passFormData);
      const res = await axios.put(
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
      console.log(res);
      toast.success("Result Given !");
      setShowPassForm(false);
      setPassFormData({
        roundResult: "PASS",
        roundFeedback: "",
        roundRating: "",
      });
      fetchShortlistedApplications();
    } catch (error) {
      toast.error("Failed to update round result");
    }
  };

  const handleAddRound = async () => {
    if (!authToken) navigator("/login");

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
      toast.error("Failed to add round");
    }
  };

  // ------------------------------
  // PORTAL MODAL (Add Round)
  // ------------------------------
  const AddRoundModal =
    showAddForm &&
    ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAddForm(false)}
        ></div>

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-6 h-6 text-green-600" />
                Add New Round
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold">
                    Round Sequence
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={app.applicationRounds.length + 1}
                    value={newRound.roundSequence}
                    onChange={(e) =>
                      setNewRound({
                        ...newRound,
                        roundSequence: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Round Type
                  </label>
                  <select
                    value={newRound.roundType}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundType: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  >
                    <option value="">Select Round Type</option>
                    {roundTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold">
                    Round Date
                  </label>
                  <input
                    type="date"
                    value={newRound.roundDate || ""}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundDate: e.target.value })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Round Time
                  </label>
                  <input
                    type="time"
                    value={newRound.roundExpectedTime || ""}
                    onChange={(e) =>
                      setNewRound({
                        ...newRound,
                        roundExpectedTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newRound.roundDurationInMinutes || ""}
                  onChange={(e) =>
                    setNewRound({
                      ...newRound,
                      roundDurationInMinutes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleAddRound}
                disabled={
                  !newRound.roundType ||
                  !newRound.roundDate ||
                  !newRound.roundExpectedTime ||
                  !newRound.roundDurationInMinutes
                }
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl"
              >
                <Save className="w-5 h-5" />
                Add Round
              </button>

              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  // ------------------------------
  // PORTAL MODAL (Edit Round)
  // ------------------------------
  const EditRoundModal =
    editingRound &&
    ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeEditModal}
        ></div>

        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-bold">Update Round</h3>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold">
                    Round Sequence
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={app.applicationRounds.length}
                    value={editingRound.roundSequence}
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundSequence: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Round Type
                  </label>
                  <input
                    disabled
                    value={editingRound.roundType}
                    className="w-full px-4 py-3 border rounded-xl bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold">
                    Round Date
                  </label>
                  <input
                    type="date"
                    value={
                      Array.isArray(editingRound.roundDate)
                        ? `${editingRound.roundDate[0]}-${String(
                            editingRound.roundDate[1]
                          ).padStart(2, "0")}-${String(
                            editingRound.roundDate[2]
                          ).padStart(2, "0")}`
                        : editingRound.roundDate || ""
                    }
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundDate: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Expected Time
                  </label>
                  <input
                    type="time"
                    value={
                      Array.isArray(editingRound.roundExpectedTime)
                        ? `${String(editingRound.roundExpectedTime[0]).padStart(
                            2,
                            "0"
                          )}:${String(
                            editingRound.roundExpectedTime[1]
                          ).padStart(2, "0")}`
                        : editingRound.roundExpectedTime || ""
                    }
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundExpectedTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingRound.roundDurationInMinutes || ""}
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundDurationInMinutes: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Round Feedback
                </label>
                <textarea
                  rows={3}
                  value={editingRound.roundStatus?.roundFeedback || ""}
                  onChange={(e) =>
                    setEditingRound({
                      ...editingRound,
                      roundStatus: {
                        ...editingRound.roundStatus,
                        roundFeedback: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeEditModal}
                  className="flex-1 px-6 py-3 border rounded-xl"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleSaveRound(editingRound.roundId)}
                  className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl"
                >
                  Update Round
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

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

          {app.applicationRounds.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Application Rounds ({app.applicationRounds.length})
              </h4>

              <div className="space-y-3">
                {app.applicationRounds
                  .sort((a, b) => a.roundSequence - b.roundSequence)
                  .map((round) => (
                    <React.Fragment key={round.roundId}>
                      <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between">
                        <div className="flex-1">
                          <div className="flex gap-4 items-center mb-2">
                            <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center">
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
                              Date:
                              <span>
                                {Array.isArray(round.roundDate)
                                  ? `${round.roundDate[2]}/${round.roundDate[1]}/${round.roundDate[0]}`
                                  : round.roundDate || "Not Set"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Time:
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
                              Duration:
                              <span>
                                {round.roundDurationInMinutes
                                  ? round.roundDurationInMinutes + " Minutes"
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              Rating:
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

                        {allowedUser() && (
                          <div className="flex items-center gap-3">
                            {round.roundResult === "PENDING" &&
                              isRoundCompleted(round) && (
                                <button
                                  onClick={() => openPassForm(round.roundId)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                >
                                  Give Result
                                </button>
                              )}

                            {!isRoundCompleted(round) && (
                              <>
                                <button
                                  onClick={() => handleEditRound(round)}
                                  className="p-2 text-blue-600"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteRound(round.roundId)
                                  }
                                  className="p-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
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

                      {(round.roundType === "TECHNICAL" ||
                        round.roundType === "HR") && (
                        <Interview
                          app={app}
                          round={round}
                          fetchShortlistedApplications={
                            fetchShortlistedApplications
                          }
                        />
                      )}
                    </React.Fragment>
                  ))}

                {allowedUser() &&
                  app.applicationStatus?.applicationStatus !== "REJECTED" && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full bg-gray-100 border-dashed rounded-xl p-3 mt-3"
                    >
                      <Plus className="w-5 h-5 inline-block" /> Add New Round
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

      {AddRoundModal}
      {EditRoundModal}

      {/* Pass Round Modal */}
      {showPassForm &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPassForm(false)}
            ></div>
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Round Result
                  </h3>
                  <button
                    onClick={() => setShowPassForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Round Result
                    </label>
                    <select
                      value={passFormData.roundResult}
                      onChange={(e) =>
                        setPassFormData({
                          ...passFormData,
                          roundResult: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                    >
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                      <option value="UNDERVALUATION">UNDERVALUATION</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Round Rating
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setPassFormData({
                                ...passFormData,
                                roundRating: star.toString(),
                              })
                            }
                            className={`p-1 ${
                              star <= parseInt(passFormData.roundRating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {passFormData.roundRating || 0}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Round Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={passFormData.roundFeedback}
                      onChange={(e) =>
                        setPassFormData({
                          ...passFormData,
                          roundFeedback: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl bg-gray-50 resize-none"
                      placeholder="Enter feedback"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowPassForm(false)}
                    className="flex-1 px-6 py-3 border rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePassRound}
                    disabled={
                      !passFormData.roundRating || !passFormData.roundFeedback
                    }
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Round;
