import React, { useContext, useState, useEffect } from "react";
import {
  Video,
  Info,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Users,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Interview({ app, round }) {
  const { authToken, userType } = useContext(AuthContext);
  const navigator = useNavigate();
  const [editingInterview, setEditingInterview] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewingInterview, setViewingInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [newInterview, setNewInterview] = useState({
    roundId: round.roundId,
    interviewLink: "",
    interviewStatus: "SCHEDULED",
    interviewerIds: [],
  });

  const allowedUser = () => {
    if (userType === "admin" || userType === "recruiter") return true;
    return false;
  };

  const allowAction = () => {
    if (
      allowedUser() &&
      round.roundStatus.roundStatus === "UNDERPROCESS" &&
      app.applicationStatus.applicationStatus !== "REJECTED"
    )
      return true;
    return false;
  };
  useEffect(() => {
    fetchInterviews();
    fetchInterviewers();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/round/${round.roundId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setInterviews(response.data);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/interviewers",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setInterviewers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch interviewers:", error);
    }
  };

  const handleAddInterview = async () => {
    if (!authToken) navigator("/login");
    try {
      await axios.post("http://localhost:8080/interviews", newInterview, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Interview added successfully!");
      setNewInterview({
        roundId: round.roundId,
        interviewLink: "",
        interviewStatus: "SCHEDULED",
        interviewerIds: [],
      });
      setShowAddForm(false);
      fetchInterviews();
    } catch (error) {
      toast.error("Failed to add interview");
    }
  };

  const handleEditInterview = (interview) => {
    setEditingInterview({ ...interview });
  };

  const handleSaveInterview = async (interviewId) => {
    try {
      await axios.put(
        `http://localhost:8080/interviews/${interviewId}`,
        editingInterview,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Interview updated successfully!");
      fetchInterviews();
      setEditingInterview(null);
    } catch (error) {
      console.log(error);
      toast.error("Failed to update interview");
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!window.confirm("Delete this interview?")) return;
    try {
      await axios.delete(`http://localhost:8080/interviews/${interviewId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Interview deleted successfully!");
      fetchInterviews();
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  const getInterviewerNames = (interviewerIds) => {
    const uniqueIds = [...new Set(interviewerIds)];
    return uniqueIds
      .map((id) => {
        const interviewer = interviewers.find((i) => i.userId === id);
        return interviewer ? `${interviewer.userName}` : "Unknown";
      })
      .join(", ");
  };

  return (
    <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-r-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-purple-600" />
          Interviews ({interviews.length})
        </h5>
        {allowAction() && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Interview
          </button>
        )}
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview.interviewId}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        interview.interviewStatus === "SCHEDULED"
                          ? "bg-blue-100 text-blue-800"
                          : interview.interviewStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {interview.interviewStatus}
                    </span>
                    {interview.interviewLink && (
                      <a
                        href={interview.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Join Interview
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      Interviewers:{" "}
                      {getInterviewerNames(interview.interviewerIds)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingInterview(interview)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {allowAction() && (
                    <>
                      <button
                        onClick={() => handleEditInterview(interview)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteInterview(interview.interviewId)
                        }
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <Info className="w-5 h-5 mx-auto mb-2" />
          <span>No interviews scheduled for this round</span>
        </div>
      )}

      {viewingInterview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingInterview(null)}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Video className="w-6 h-6 text-purple-600" />
                    Interview Details
                  </h3>
                  <button
                    onClick={() => setViewingInterview(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Interview ID
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {viewingInterview.interviewId}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Round ID
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                        {viewingInterview.roundId}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interview Status
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          viewingInterview.interviewStatus === "SCHEDULED"
                            ? "bg-blue-100 text-blue-800"
                            : viewingInterview.interviewStatus === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {viewingInterview.interviewStatus}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interview Link
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      {viewingInterview.interviewLink ? (
                        <a
                          href={viewingInterview.interviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {viewingInterview.interviewLink}
                        </a>
                      ) : (
                        <span className="text-gray-500">No link provided</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Interviewers
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="space-y-2">
                        {viewingInterview.interviewerIds.length === 0 ? (
                          <div className="text-gray-500">
                            No interviewers assigned
                          </div>
                        ) : (
                          [...new Set(viewingInterview.interviewerIds)].map((id,index) => {
                            const interviewer = interviewers.find(i => i.userId === id);
                            return interviewer ? (
                              <div key={id} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                                <div className="flex items-center gap-2">
                                  <label>{index + 1}.</label>
                                  <img src={interviewer.userImageUrl} alt={`${interviewer.userName}`} className="w-8 h-8 rounded-full" />
                                  <div className="text-sm text-gray-600">{interviewer.userName} • {interviewer.userEmail}</div>
                                </div>
                              </div>
                            ) : (
                              <div key={id} className="text-gray-500">Unknown Interviewer (ID: {id})</div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setViewingInterview(null)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <Plus className="w-6 h-6 text-purple-600" />
                    Add New Interview
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Link
                    </label>
                    <input
                      type="url"
                      value={newInterview.interviewLink}
                      onChange={(e) =>
                        setNewInterview({
                          ...newInterview,
                          interviewLink: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                      placeholder="https://meet.google.com/..."
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Interview Status</label>
                    <select
                      value={newInterview.interviewStatus}
                      onChange={(e) => setNewInterview({...newInterview, interviewStatus: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div> */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Interviewers
                    </label>
                    <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gray-50">
                      {interviewers.map((interviewer) => (
                        <label
                          key={interviewer.userId}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newInterview.interviewerIds.includes(
                              interviewer.userId
                            )}
                            onChange={(e) => {
                              const currentIds = [...new Set(newInterview.interviewerIds)];
                              if (e.target.checked) {
                                setNewInterview({
                                  ...newInterview,
                                  interviewerIds: [...currentIds, interviewer.userId],
                                });
                              } else {
                                setNewInterview({
                                  ...newInterview,
                                  interviewerIds: currentIds.filter(id => id !== interviewer.userId),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <img
                            src={interviewer.userImageUrl}
                            alt={interviewer.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm">
                            {interviewer.userName} | {interviewer.userEmail}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleAddInterview}
                    disabled={newInterview.interviewerIds.length === 0 || !newInterview.interviewLink}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Add Interview
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

      {editingInterview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingInterview(null)}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Update Interview
                  </h3>
                  <button
                    onClick={() => setEditingInterview(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Link
                    </label>
                    <input
                      type="url"
                      value={editingInterview.interviewLink}
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          interviewLink: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Status
                    </label>
                    <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white text-gray-400">
                      {editingInterview.interviewStatus === "SCHEDULED"
                        ? "Scheduled"
                        : editingInterview.interviewStatus === "COMPLETED"
                        ? "Completed"
                        : "Cancelled"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Interviewers
                    </label>
                    <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gray-50">
                      {interviewers.map((interviewer) => (
                        <label
                          key={interviewer.userId}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={editingInterview.interviewerIds.includes(
                              interviewer.userId
                            )}
                            onChange={(e) => {
                              const currentIds = [...new Set(editingInterview.interviewerIds)];
                              if (e.target.checked) {
                                setEditingInterview({
                                  ...editingInterview,
                                  interviewerIds: [...currentIds, interviewer.userId],
                                });
                              } else {
                                setEditingInterview({
                                  ...editingInterview,
                                  interviewerIds: currentIds.filter(id => id !== interviewer.userId),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <img
                            src={interviewer.userImageUrl}
                            alt={interviewer.userName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm">
                            {interviewer.userName} | {interviewer.userEmail}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setEditingInterview(null)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleSaveInterview(editingInterview.interviewId)
                    }
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg"
                  >
                    Update Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
