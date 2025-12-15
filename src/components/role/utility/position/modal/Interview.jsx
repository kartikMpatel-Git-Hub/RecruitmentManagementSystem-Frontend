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
    numberOfInterviewers: 1,
    interviewTime: "",
    interviewEndTime: "",
    interviewDate: "",
  });

  const allowedUser = () => {
    if (userType === "admin" || userType === "recruiter") return true;
    return false;
  };
  const isInterviewCompleted = (interview) => {
    if (interview.interviewStatus?.toLowerCase() === "completed") return true;

    const now = new Date();
    const interviewDate = Array.isArray(interview.interviewDate)
      ? new Date(
          interview.interviewDate[0],
          interview.interviewDate[1] - 1,
          interview.interviewDate[2]
        )
      : new Date(interview.interviewDate);

    const interviewEndTime = Array.isArray(interview.interviewEndTime)
      ? new Date(
          interviewDate.getFullYear(),
          interviewDate.getMonth(),
          interviewDate.getDate(),
          interview.interviewEndTime[0],
          interview.interviewEndTime[1]
        )
      : new Date(
          `${interviewDate.toDateString()} ${interview.interviewEndTime}`
        );

    if (now > interviewEndTime && interview.interviewStatus === "SCHEDULED") {
      interviewComplete(interview);
      return true;
    }
    return false;
  };

  const interviewComplete = async (interview) => {
    try {
      const res = await axios.put(
        `http://localhost:8080/interviews/complete/${interview.interviewId}`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    }
  };

  const allowAction = () => {
    if (
      allowedUser() &&
      app.applicationStatus.applicationStatus !== "REJECTED" &&
      round.roundResult === "PENDING"
    )
      return true;
    return false;
  };
  useEffect(() => {
    fetchInterviews();
    if (round.roundType === "HR") fetchHrs();
    else fetchInterviewers();
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
  const fetchHrs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/hrs", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInterviewers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch interviewers:", error);
    }
  };

  const handleAddInterview = async () => {
    if (!authToken) navigator("/login");
    try {
      const res = await axios.post("http://localhost:8080/interviews/", newInterview, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Interview added successfully!");
      setNewInterview({
        roundId: round.roundId,
        interviewLink: "",
        interviewStatus: "SCHEDULED",
        interviewerIds: [],
        numberOfInterviewers: 1,
        interviewTime: "",
        interviewEndTime: "",
        interviewDate: "",
      });
      setShowAddForm(false);
      fetchInterviews();
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleEditInterview = (interview) => {
    const interviewerIds =
      interview.interviewers?.map((i) => i.interviewer?.userId) ||
      interview.interviewerIds ||
      [];
    setEditingInterview({
      ...interview,
      interviewerIds: interviewerIds,
    });
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
                      {interview.interviewers?.length > 0
                        ? interview.interviewers
                            .map((i) => i.interviewer?.userName)
                            .filter(Boolean)
                            .join(", ")
                        : getInterviewerNames(interview.interviewerIds || [])}
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
                  {allowAction() && !isInterviewCompleted(interview) && (
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
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Video className="w-6 h-6 text-purple-600" />
                      Interview Details #{viewingInterview.interviewId}
                    </h3>
                    <button
                      onClick={() => setViewingInterview(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Interview Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Interview ID</p>
                        <p className="font-medium text-gray-900">
                          {viewingInterview.interviewId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Round ID</p>
                        <p className="font-medium text-gray-900">
                          {viewingInterview.roundId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                      <div>
                        <p className="text-sm text-gray-600">Interview Date</p>
                        <p className="font-medium text-gray-900">
                          {Array.isArray(viewingInterview.interviewDate)
                            ? `${String(
                                viewingInterview.interviewDate[2]
                              ).padStart(2, "0")}/${String(
                                viewingInterview.interviewDate[1]
                              ).padStart(2, "0")}/${
                                viewingInterview.interviewDate[0]
                              }`
                            : viewingInterview.interviewDate || "Not Set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Start Time</p>
                        <p className="font-medium text-gray-900">
                          {Array.isArray(viewingInterview.interviewTime)
                            ? `${String(
                                viewingInterview.interviewTime[0]
                              ).padStart(2, "0")}:${String(
                                viewingInterview.interviewTime[1]
                              ).padStart(2, "0")}`
                            : viewingInterview.interviewTime || "Not Set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">End Time</p>
                        <p className="font-medium text-gray-900">
                          {Array.isArray(viewingInterview.interviewEndTime)
                            ? `${String(
                                viewingInterview.interviewEndTime[0]
                              ).padStart(2, "0")}:${String(
                                viewingInterview.interviewEndTime[1]
                              ).padStart(2, "0")}`
                            : viewingInterview.interviewEndTime || "Not Set"}
                        </p>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-sm text-gray-600">Interview Link</p>
                        {viewingInterview.interviewLink ? (
                          <a
                            href={viewingInterview.interviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm break-all"
                          >
                            {viewingInterview.interviewLink}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No link provided
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">
                      Interviewers & Feedback
                    </h4>
                    {viewingInterview.interviewers?.map(
                      (interviewerObj, index) => {
                        const interviewer = interviewerObj.interviewer;
                        const feedback = interviewerObj.interviewerFeedback;
                        return interviewer ? (
                          <div
                            key={interviewer.userId}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={interviewer.userImageUrl}
                                alt={interviewer.userName}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {interviewer.userName}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {interviewer.userEmail}
                                </p>
                              </div>
                            </div>

                            {feedback && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <h5 className="font-medium text-gray-900 mb-2">
                                  Feedback
                                </h5>

                                {feedback.interviewFeedback && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700">
                                      Overall Feedback:
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      {feedback.interviewFeedback}
                                    </p>
                                  </div>
                                )}

                                {feedback.skillRatings?.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                      Skill Ratings:
                                    </p>
                                    <div className="space-y-3">
                                      {feedback.skillRatings.map(
                                        (skillRating) => (
                                          <div
                                            key={skillRating.skillRatingId}
                                            className="border-l-4 border-blue-200 pl-3"
                                          >
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="text-sm font-medium text-gray-700">
                                                {skillRating.skill?.skill}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <div className="flex text-yellow-400">
                                                  {[...Array(5)].map((_, i) => (
                                                    <span
                                                      key={i}
                                                      className={
                                                        i <
                                                        skillRating.skillRating
                                                          ? ""
                                                          : "opacity-30"
                                                      }
                                                    >
                                                      ★
                                                    </span>
                                                  ))}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                  ({skillRating.skillRating}/5)
                                                </span>
                                              </div>
                                            </div>
                                            {skillRating.skillFeedback && (
                                              <div className="mt-1">
                                                <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                                                  {skillRating.skillFeedback}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : null;
                      }
                    )}
                  </div>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Interview Date
                      </label>
                      <input
                        type="date"
                        value={newInterview.interviewDate}
                        onChange={(e) =>
                          setNewInterview({
                            ...newInterview,
                            interviewDate: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={newInterview.interviewTime}
                        onChange={(e) =>
                          setNewInterview({
                            ...newInterview,
                            interviewTime: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={newInterview.interviewEndTime}
                        onChange={(e) =>
                          setNewInterview({
                            ...newInterview,
                            interviewEndTime: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Number Of Interviewers
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={newInterview.numberOfInterviewers}
                      onChange={(e) =>
                        setNewInterview({
                          ...newInterview,
                          numberOfInterviewers: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleAddInterview}
                    disabled={
                      !newInterview.numberOfInterviewers ||
                      !newInterview.interviewLink ||
                      !newInterview.interviewDate ||
                      !newInterview.interviewTime ||
                      !newInterview.interviewEndTime
                    }
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
                    <select
                      value={editingInterview.interviewStatus}
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          interviewStatus: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Time
                    </label>
                    <input
                      type="time"
                      value={
                        Array.isArray(editingInterview.interviewTime)
                          ? `${String(
                              editingInterview.interviewTime[0]
                            ).padStart(2, "0")}:${String(
                              editingInterview.interviewTime[1]
                            ).padStart(2, "0")}`
                          : editingInterview.interviewTime || ""
                      }
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          interviewTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview End Time
                    </label>
                    <input
                      type="time"
                      value={
                        Array.isArray(editingInterview.interviewEndTime)
                          ? `${String(
                              editingInterview.interviewEndTime[0]
                            ).padStart(2, "0")}:${String(
                              editingInterview.interviewEndTime[1]
                            ).padStart(2, "0")}`
                          : editingInterview.interviewEndTime || ""
                      }
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          interviewEndTime: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Date
                    </label>
                    <input
                      type="date"
                      value={
                        Array.isArray(editingInterview.interviewDate)
                          ? `${editingInterview.interviewDate[0]}-${String(
                              editingInterview.interviewDate[1]
                            ).padStart(2, "0")}-${String(
                              editingInterview.interviewDate[2]
                            ).padStart(2, "0")}`
                          : editingInterview.interviewDate || ""
                      }
                      onChange={(e) =>
                        setEditingInterview({
                          ...editingInterview,
                          interviewDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Interviewers
                    </label>
                    <div className="max-h-40 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gray-50">
                      {interviewers.map((interviewer) => {
                        return (
                          <label
                            key={interviewer.userId}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={
                                editingInterview.interviewerIds?.includes(
                                  interviewer.userId
                                ) || false
                              }
                              onChange={(e) => {
                                const currentIds =
                                  editingInterview.interviewerIds || [];
                                if (e.target.checked) {
                                  setEditingInterview({
                                    ...editingInterview,
                                    interviewerIds: [
                                      ...currentIds,
                                      interviewer.userId,
                                    ],
                                  });
                                } else {
                                  setEditingInterview({
                                    ...editingInterview,
                                    interviewerIds: currentIds.filter(
                                      (id) => id !== interviewer.userId
                                    ),
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
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Interview Feedback
                    </label>
                    <textarea
                      value={
                        editingInterview.interviewers?.[0]?.interviewerFeedback
                          ?.interviewFeedback || ""
                      }
                      onChange={(e) => {
                        const updatedInterviewers = [
                          ...(editingInterview.interviewers || []),
                        ];
                        if (updatedInterviewers[0]) {
                          updatedInterviewers[0] = {
                            ...updatedInterviewers[0],
                            interviewerFeedback: {
                              ...updatedInterviewers[0].interviewerFeedback,
                              interviewFeedback: e.target.value,
                            },
                          };
                        }
                        setEditingInterview({
                          ...editingInterview,
                          interviewers: updatedInterviewers,
                        });
                      }}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 bg-gray-50 focus:bg-white resize-none"
                      placeholder="Enter interview feedback..."
                    />
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
