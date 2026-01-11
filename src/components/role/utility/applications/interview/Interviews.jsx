import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  MessageSquare,
  Video,
  User,
  Link as LinkIcon,
  Users,
  Eye,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import Layout from "../../Layout";

function Interviews() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const { authToken, userType } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingInterview, setAddingInterview] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const [newInterview, setNewInterview] = useState({
    roundId: parseInt(rid),
    interviewDate: "",
    interviewTime: "",
    interviewEndTime: "",
    interviewLink: "",
    numberOfInterviewers: 1,
    interviewerIds: [],
  });

  const allowedUser = () => userType === "admin" || userType === "hr";

  const isApplicationActive = () => {
    return (
      applicationStatus === "PENDING" || applicationStatus === "UNDERVALUATION"
    );
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "Not Set";
    const [year, month, day] = dateArray;
    return `${day}/${month}/${year}`;
  };

  const navigateToCandidate = (candidateId) => {
    navigate(
      `/${userType.toLowerCase()}/candidates/${candidateId}?page=profile`
    );
  };

  const navigateToPosition = (positionId) => {
    navigate(`/${userType.toLowerCase()}/positions/${positionId}`);
  };

  const formatTime = (timeArray) => {
    if (!timeArray || timeArray.length < 2) return "Not Set";
    const [hours, minutes] = timeArray;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/rounds/${rid}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInterviews(response.data.interviews || []);
      setApplicationStatus(response.data.roundResult);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken || !rid) {
      return navigate("/login");
    }
    fetchInterviews();
  }, [authToken, rid]);

  const getStatusBadge = (status) => {
    const statusColors = {
      COMPLETED: "bg-green-100 text-green-800",
      SCHEDULED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      UNDERPROCESS: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      ONHOLD: "bg-purple-100 text-purple-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const isInterviewCompleted = (interview) => {
    if (interview.interviewStatus === "COMPLETED") return true;

    if (!interview.interviewDate || !interview.interviewEndTime) return false;

    const now = new Date();
    const interviewDate = Array.isArray(interview.interviewDate)
      ? new Date(
          interview.interviewDate[0],
          interview.interviewDate[1] - 1,
          interview.interviewDate[2]
        )
      : new Date(interview.interviewDate);

    const endTime = Array.isArray(interview.interviewEndTime)
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

    if (now > endTime) {
      handleCompleteInterview(interview.interviewId);
    }

    return now > endTime;
  };

  const handleAddInterview = async () => {
    if (!authToken) return;

    if (!newInterview.interviewDate) return toast.error("Please select a date");
    if (!newInterview.interviewTime)
      return toast.error("Please select start time");
    if (!newInterview.interviewEndTime)
      return toast.error("Please select end time");

    setAddingInterview(true);

    const requestBody = {
      roundId: parseInt(rid),
      interviewDate: newInterview.interviewDate,
      interviewTime: newInterview.interviewTime,
      interviewEndTime: newInterview.interviewEndTime,
      interviewLink: newInterview.interviewLink || null,
      numberOfInterviewers: newInterview.numberOfInterviewers || 1,
      interviewerIds:
        newInterview.interviewerIds.length > 0
          ? newInterview.interviewerIds
          : null,
    };

    try {
      await axios.post(`http://localhost:8080/interviews`, requestBody, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      toast.success("Interview added successfully!");
      setShowAddForm(false);
      setNewInterview({
        roundId: parseInt(rid),
        interviewDate: "",
        interviewTime: "",
        interviewEndTime: "",
        interviewLink: "",
        numberOfInterviewers: 1,
        interviewerIds: [],
      });
      fetchInterviews();
    } catch (error) {
      console.error(error);
      toast.error(error.response.data || "Failed to add interview");
    } finally {
      setAddingInterview(false);
    }
  };

  const handleEditInterview = (interview) => {
    setEditingInterview({
      ...interview,
      interviewDate: Array.isArray(interview.interviewDate)
        ? `${interview.interviewDate[0]}-${String(
            interview.interviewDate[1]
          ).padStart(2, "0")}-${String(interview.interviewDate[2]).padStart(
            2,
            "0"
          )}`
        : interview.interviewDate || "",
      interviewTime: Array.isArray(interview.interviewTime)
        ? `${String(interview.interviewTime[0]).padStart(2, "0")}:${String(
            interview.interviewTime[1]
          ).padStart(2, "0")}`
        : interview.interviewTime || "",
      interviewEndTime: Array.isArray(interview.interviewEndTime)
        ? `${String(interview.interviewEndTime[0]).padStart(2, "0")}:${String(
            interview.interviewEndTime[1]
          ).padStart(2, "0")}`
        : interview.interviewEndTime || "",
    });
  };

  const closeEditModal = () => setEditingInterview(null);

  const handleSaveInterview = async (interviewId) => {
    if (!editingInterview) return;

    const requestBody = {
      interviewDate: editingInterview.interviewDate,
      interviewTime: editingInterview.interviewTime,
      interviewEndTime: editingInterview.interviewEndTime,
      interviewLink: editingInterview.interviewLink,
    };

    try {
      await axios.put(
        `http://localhost:8080/interviews/${interviewId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Interview updated successfully!");
      fetchInterviews();
      closeEditModal();
    } catch (error) {
      console.error(error);
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
      console.error(error);
      toast.error("Failed to delete interview");
    }
  };

  const handleCompleteInterview = async (interviewId) => {
    try {
      await axios.get(
        `http://localhost:8080/interviews/${interviewId}/complete`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      fetchInterviews();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Interviews
                </h1>
                <p className="text-gray-600 text-lg">
                  Round #{rid} • Total: {interviews.length} interviews
                </p>
              </div>
            </div>

            {allowedUser() && isApplicationActive() && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Add Interview
              </button>
            )}
          </div>
        </div>
        {interviews.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
            <Video className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Interviews Found
            </h3>
            <p className="text-gray-600 text-lg">
              No interviews have been scheduled for this round yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                      {interview.interviewId}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Interview #{interview.interviewId}
                      </h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          interview.interviewStatus || "PENDING"
                        )}`}
                      >
                        {interview.interviewStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToCandidate(interview.candidateId)}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      title="View Candidate Profile"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Candidate</span>
                    </button>
                    <button
                      onClick={() => navigateToPosition(interview.positionId)}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                      title="View Position"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm font-medium">Position</span>
                    </button>

                    {allowedUser() && isApplicationActive() && (
                      <>
                        {interview.interviewStatus !== "COMPLETED" &&
                          isInterviewCompleted(interview) && (
                            <button
                              onClick={() =>
                                handleCompleteInterview(interview.interviewId)
                              }
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}

                        {!isInterviewCompleted(interview) && (
                          <>
                            <button
                              onClick={() => handleEditInterview(interview)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit Interview"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteInterview(interview.interviewId)
                              }
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Interview"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(interview.interviewDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 text-xs">Time</p>
                      <p className="font-medium text-gray-900">
                        {formatTime(interview.interviewTime)} -{" "}
                        {formatTime(interview.interviewEndTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <LinkIcon className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 text-xs">Interview Link</p>
                      {interview.interviewLink ? (
                        <a
                          href={interview.interviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline truncate block max-w-[120px]"
                        >
                          Join Meeting
                        </a>
                      ) : (
                        <p className="font-medium text-gray-900">Not Set</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-gray-500 text-xs">Application</p>
                      <p className="font-medium text-gray-900">
                        #{interview.applicationId}
                      </p>
                    </div>
                  </div>
                </div>
                {interview.interviewers &&
                  interview.interviewers.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-gray-600" />
                        <h4 className="text-lg font-semibold text-gray-800">
                          Interviewers ({interview.interviewers.length})
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {interview.interviewers.map((interviewerData) => (
                          <div
                            key={interviewerData.interviewInterviewerId}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {interviewerData.interviewer?.userImageUrl ? (
                                  <img
                                    src={
                                      interviewerData.interviewer.userImageUrl
                                    }
                                    alt={interviewerData.interviewer.username}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {interviewerData.interviewer?.username ||
                                      "N/A"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {interviewerData.interviewer?.userEmail ||
                                      "N/A"}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  interviewerData.isFeedbackGiven
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {interviewerData.isFeedbackGiven
                                  ? "Feedback Given"
                                  : "Pending"}
                              </span>
                            </div>
                            {interviewerData.isFeedbackGiven &&
                              interviewerData.interviewerFeedback && (
                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                      Feedback
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-4">
                                    {
                                      interviewerData.interviewerFeedback
                                        .interviewFeedback
                                    }
                                  </p>
                                  {interviewerData.interviewerFeedback
                                    .skillRatings &&
                                    interviewerData.interviewerFeedback
                                      .skillRatings.length > 0 && (
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                                          Skill Ratings
                                        </h5>
                                        <div className="space-y-2">
                                          {interviewerData.interviewerFeedback.skillRatings.map(
                                            (skillRating) => (
                                              <div
                                                key={skillRating.skillRatingId}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                              >
                                                <div className="flex-1">
                                                  <p className="font-medium text-gray-900">
                                                    {skillRating.skill?.skill ||
                                                      "N/A"}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    {skillRating.skillFeedback}
                                                  </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <div className="flex text-yellow-400">
                                                    {[...Array(5)].map(
                                                      (_, i) => (
                                                        <Star
                                                          key={i}
                                                          className={`w-4 h-4 fill-current ${
                                                            i <
                                                            skillRating.skillRating
                                                              ? ""
                                                              : "opacity-30"
                                                          }`}
                                                        />
                                                      )
                                                    )}
                                                  </div>
                                                  <span className="text-xs text-gray-600">
                                                    ({skillRating.skillRating}
                                                    /5)
                                                  </span>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Add New Interview
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    placeholder="https://meet.google.com/..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Interviewers
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newInterview.numberOfInterviewers}
                    onChange={(e) =>
                      setNewInterview({
                        ...newInterview,
                        numberOfInterviewers: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddInterview}
                  disabled={addingInterview}
                  className={`px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg transition-all ${
                    addingInterview
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:from-slate-700 hover:to-slate-800"
                  }`}
                >
                  {addingInterview ? "Adding..." : "Add Interview"}
                </button>
              </div>
            </div>
          </div>
        )}
        {editingInterview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Interview
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingInterview.interviewDate}
                    onChange={(e) =>
                      setEditingInterview({
                        ...editingInterview,
                        interviewDate: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={editingInterview.interviewTime}
                    onChange={(e) =>
                      setEditingInterview({
                        ...editingInterview,
                        interviewTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={editingInterview.interviewEndTime}
                    onChange={(e) =>
                      setEditingInterview({
                        ...editingInterview,
                        interviewEndTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Link
                  </label>
                  <input
                    type="url"
                    value={editingInterview.interviewLink || ""}
                    onChange={(e) =>
                      setEditingInterview({
                        ...editingInterview,
                        interviewLink: e.target.value,
                      })
                    }
                    placeholder="https://meet.google.com/..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleSaveInterview(editingInterview.interviewId)
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Interviews;
