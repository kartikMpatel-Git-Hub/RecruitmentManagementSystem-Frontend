import React, { useContext, useState } from "react";
import {
  Clock,
  Info,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Calendar,
  Stars,
  Star,
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

  const allowedUser = () => {
    if (userType === "admin" || userType === "recruiter") return true;
    return false;
  };

  const handleEditRound = (round) => {
    setEditingRound({ ...round });
  };

  const closeEditModal = () => {
    setEditingRound(null);
  };

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
      setEditingRound(null);
    } catch (error) {
      console.log(error);

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
      toast.error("Failed to delete round");
    }
  };

  const handleAddRound = async () => {
    if (!authToken) navigator("/login");

    if (!newRound.roundType) {
      toast.error("Please select a round type");
      return;
    }
    if (!newRound.roundSequence || newRound.roundSequence < 1) {
      toast.error("Please enter a valid round sequence");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/rounds/applications/${app.applicationId}`,
        newRound,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Round added successfully!");
      setNewRound({
        roundType: "",
        roundSequence: app.applicationRounds.length + 2,
        roundDate: "",
        roundExpectedTime: "",
        roundDurationInMinutes: "",
      });
      setShowAddForm(false);
      fetchShortlistedApplications();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add round");
    }
  };
  return (
    <>
      <tr>
        <td colSpan="6" className="px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={() => openHoldStatus(app.applicationId)}
              className="bg-slate-800 font-semibold text-white p-3 rounded-2xl"
            >
              {/* { === "HONHOLD" ? "Unhold" : "Hold"} Application */}
              {app.applicationStatus.applicationStatus === "ONHOLD"
                ? "Unhold"
                : "Hold"}{" "}
              Application
            </button>
          </div>
          {app.applicationRounds.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                Application Rounds ({app.applicationRounds.length})
              </h4>
              <div className="space-y-2">
                {app.applicationRounds
                  .sort((a, b) => a.roundSequence - b.roundSequence)
                  .map((round) => (
                    <>
                      <div
                        key={round.roundId}
                        className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {round.roundSequence}
                            </div>
                            <div className="font-semibold text-gray-900">
                              {round.roundType.replace("_", " ")}
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                round.roundResult === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : round.roundResult === "PASS"
                                  ? "bg-green-100 text-green-800"
                                  : round.roundResult === "FAIL"
                                  ? "bg-red-100 text-red-800"
                                  : round.roundResult === "UNDERVALUATION"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {round.roundResult}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Date:</span>
                              <span className="font-medium">
                                {Array.isArray(round.roundDate)
                                  ? `${round.roundDate[2]}/${round.roundDate[1]}/${round.roundDate[0]}`
                                  : round.roundDate || "Not Set"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Time:</span>
                              <span className="font-medium">
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
                              <BiStopwatch className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Duration :</span>
                              <span className="font-medium">
                                {round.roundDurationInMinutes} Minutes
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Rating:</span>
                              <span className="font-medium">
                                {round.roundStatus?.rating
                                  ? `${round.roundStatus.rating}/10`
                                  : "Not Rated"}
                              </span>
                            </div>
                          </div>
                          {round.roundStatus?.roundFeedback && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-600">Feedback: </span>
                              <span className="text-gray-700">
                                {round.roundStatus.roundFeedback}
                              </span>
                            </div>
                          )}
                        </div>
                        {allowedUser() && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditRound(round)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shadow-sm border border-blue-200"
                              title="Edit Round"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRound(round.roundId)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm border border-red-200"
                              title="Delete Round"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                    </>
                  ))}
                {showAddForm ? (
                  <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                      onClick={() => setShowAddForm(false)}
                    ></div>
                    <div className="flex min-h-full items-center justify-center p-4">
                      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
                        <div className="p-6">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                  Round Sequence
                                </label>
                                <input
                                  type="number"
                                  value={newRound.roundSequence}
                                  min={1}
                                  max={app.applicationRounds.length+1}
                                  onChange={(e) =>
                                    setNewRound({
                                      ...newRound,
                                      roundSequence: parseInt(e.target.value),
                                    })
                                  }
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                                  placeholder="Enter sequence"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                  Round Type
                                </label>
                                <select
                                  value={newRound.roundType}
                                  onChange={(e) =>
                                    setNewRound({
                                      ...newRound,
                                      roundType: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
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
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                  Round Date
                                </label>
                                <input
                                  type="date"
                                  value={newRound.roundDate || ""}
                                  onChange={(e) =>
                                    setNewRound({
                                      ...newRound,
                                      roundDate: e.target.value,
                                    })
                                  }
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                  Round Duration (in minutes)
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
                                  placeholder="Enter Duration In Minutes"
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-8">
                            <button
                              onClick={handleAddRound}
                              disabled={
                                !newRound.roundType ||
                                !newRound.roundDate ||
                                !newRound.roundExpectedTime ||
                                !newRound.roundDurationInMinutes ||
                                newRound.roundSequence < 1
                              }
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                            >
                              <Save className="w-5 h-5" />
                              Add Round
                            </button>
                            <button
                              onClick={() => setShowAddForm(false)}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                            >
                              <X className="w-5 h-5" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  allowedUser() &&
                  app.applicationStatus?.applicationStatus !== "REJECTED" && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="w-full bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-gray-100 hover:border-slate-400 transition-all flex items-center justify-center gap-2 font-medium shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Round
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                <Info className="w-5 h-5" />
                <span>No Round Specified For This Application</span>
              </div>
              {showAddForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowAddForm(false)}
                  ></div>
                  <div className="flex min-h-full items-center justify-center p-4">
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
                      <div className="p-6">
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                                placeholder="Enter sequence"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Round Type
                              </label>
                              <select
                                value={newRound.roundType}
                                onChange={(e) =>
                                  setNewRound({
                                    ...newRound,
                                    roundType: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
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
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Round Date
                              </label>
                              <input
                                type="date"
                                value={newRound.roundDate || ""}
                                onChange={(e) =>
                                  setNewRound({
                                    ...newRound,
                                    roundDate: e.target.value,
                                  })
                                }
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Round Duration (in minutes)
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
                                placeholder="Enter Duration In Minutes"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-gray-50 focus:bg-white"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                          <button
                            onClick={handleAddRound}
                            disabled={
                              !newRound.roundType ||
                              !newRound.roundDate ||
                              !newRound.roundExpectedTime ||
                              !newRound.roundDurationInMinutes ||
                              newRound.roundSequence < 1
                            }
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                          >
                            <Save className="w-5 h-5" />
                            Add Round
                          </button>
                          <button
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {allowedUser() &&
                app.applicationStatus?.applicationStatus !== "REJECTED" && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-slate-600 hover:bg-gradient-to-r hover:from-slate-100 hover:to-gray-100 hover:border-slate-400 transition-all flex items-center justify-center gap-2 mx-auto font-medium shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Round
                  </button>
                )}
            </div>
          )}
        </td>
      </tr>

      {editingRound && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeEditModal}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Update Round Status
                  </h3>
                  <button
                    onClick={closeEditModal}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Round Type
                      </label>
                      <select
                        value={editingRound.roundType}
                        disabled={true}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white text-slate-400"
                      >
                        {roundTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Expected Time
                      </label>
                      <input
                        type="time"
                        value={
                          Array.isArray(editingRound.roundExpectedTime)
                            ? `${String(
                                editingRound.roundExpectedTime[0]
                              ).padStart(2, "0")}:${String(
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Duration (Minutes)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingRound.roundDurationInMinutes || ""}
                        onChange={(e) =>
                          setEditingRound({
                            ...editingRound,
                            roundDurationInMinutes:
                              parseInt(e.target.value) || "",
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                        placeholder="Duration in minutes"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Rating
                    </label>
                    <input
                      type="text"
                      disabled={true}
                      min="0"
                      max="10"
                      step="0.1"
                      value={editingRound.roundStatus?.rating || ""}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white text-gray-400"
                      placeholder="will Be Rated After Completion"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Round Feedback
                    </label>
                    <textarea
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white resize-none"
                      rows="4"
                      placeholder="Enter feedback for this round..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveRound(editingRound.roundId)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold shadow-lg"
                    >
                      Update Round
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Round;
