import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
  Video,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { BiStopwatch } from "react-icons/bi";
import Layout from "../../Layout";

function Rounds() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, userType } = useContext(AuthContext);

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationData, setApplicationData] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [showPassForm, setShowPassForm] = useState(false);
  const [passingRoundId, setPassingRoundId] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    applicationStatus: "",
    applicationFeedback: "",
  });

  const [passFormData, setPassFormData] = useState({
    roundResult: "PASS",
    roundFeedback: "",
    roundRating: "",
  });

  const [newRound, setNewRound] = useState({
    roundType: "",
    roundSequence: 1,
    roundDate: "",
    roundExpectedTime: "",
    roundDurationInMinutes: "",
  });

  const roundTypes = useMemo(
    () => ["APTITUDE", "GROUP_DISCUSSION", "CODING", "TECHNICAL", "HR", "CEO"],
    []
  );

  const getAvailableStatusOptions = () => {
    if (applicationStatus === "SHORTLISTED") {
      return ["SHORTLISTED", "ONHOLD", "DOCUMENT_VERIFICATION"];
    }
    if (applicationStatus === "ONHOLD") {
      return ["ONHOLD", "SHORTLISTED", "REJECTED"];
    }
    if (applicationStatus === "DOCUMENT_VERIFICATION") {
      return ["DOCUMENT_VERIFICATION", "SHORTLISTED", "REJECTED", "ONHOLD"];
    }
    return ["SHORTLISTED", "REJECTED","DOCUMENT_VERIFICATION", "ONHOLD"];
  };

  const allowedUser = () => userType === "admin" || userType === "hr";

  const isApplicationActive = () => {
    return (
      applicationStatus === "SHORTLISTED" || applicationStatus === "UNDERPROCESS"
    );
  };

  const areAllRoundsPassed = () => {
    if (rounds.length === 0) return false;
    return rounds.every((round) => round.roundResult === "PASS");
  };

  const canChangeStatus = () => {
    return (
      applicationStatus === "SHORTLISTED" ||
      applicationStatus === "UNDERPROCESS" ||
      applicationStatus === "ONHOLD"
    );
  };

  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      const application = response.data;
      setApplicationData(application);
      
      if (application?.applicationStatus?.applicationStatus) {
        setApplicationStatus(application.applicationStatus.applicationStatus);
      }

      const roundsData = application?.rounds || [];
      setRounds(roundsData);
      
      setNewRound((prev) => ({
        ...prev,
        roundSequence: (roundsData?.length || 0) + 1,
      }));
    } catch (error) {
      console.error("Error fetching rounds:", error);
      toast.error("Failed to fetch rounds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken || !id) {
      return navigate("/login");
    }
    fetchRounds();
  }, [authToken, id]);

  const isRoundCompleted = (round) => {
    if (round.roundStatus?.roundStatus === "COMPLETED") return true;

    if (
      !round.roundDate ||
      !round.roundExpectedTime ||
      !round.roundDurationInMinutes
    )
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

  const handleAddRound = async () => {
    if (!authToken) return;

    if (!newRound.roundType) return toast.error("Please select a round type");
    if (!newRound.roundSequence || newRound.roundSequence < 1)
      return toast.error("Enter a valid sequence");

    try {
      await axios.post(
        `http://localhost:8080/rounds/applications/${id}`,
        newRound,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      toast.success("Round added successfully!");
      setShowAddForm(false);
      setNewRound({
        roundType: "",
        roundSequence: rounds.length + 2,
        roundDate: "",
        roundExpectedTime: "",
        roundDurationInMinutes: "",
      });
      fetchRounds();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add round");
    }
  };

  const handleEditRound = (round) => setEditingRound({ ...round });
  const closeEditModal = () => setEditingRound(null);

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
      fetchRounds();
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
      fetchRounds();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete round");
    }
  };

  const openPassForm = (roundId) => {
    setPassingRoundId(roundId);
    setShowPassForm(true);
  };

  const openStatusModal = () => {
    setStatusFormData({
      applicationStatus: applicationStatus || "",
      applicationFeedback: "",
    });
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!statusFormData.applicationStatus) {
      return toast.error("Please select a status");
    }

    if (statusFormData.applicationStatus === "DOCUMENT_VERIFICATION") {
      if (rounds.length === 0) {
        return toast.error("Cannot move to Document Verification: No rounds have been added yet");
      }
      if (!areAllRoundsPassed()) {
        return toast.error("Cannot move to Document Verification: All rounds must be passed first");
      }
    }

    const applicationStatusId = applicationData?.applicationStatus?.applicationStatusId;
    if (!applicationStatusId) {
      return toast.error("Application status ID not found");
    }

    try {
      await axios.patch(
        `http://localhost:8080/applications/${id}/application-status/${applicationStatusId}`,
        {
          applicationStatus: statusFormData.applicationStatus,
          applicationFeedback: statusFormData.applicationFeedback || null,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Application status updated successfully!");
      setShowStatusModal(false);
      setStatusFormData({ applicationStatus: "", applicationFeedback: "" });
      fetchRounds();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update application status");
    }
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
      fetchRounds();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update round result");
    }
  };

  const navigateToInterviews = (roundId) => {
    navigate(`./${roundId}/interviews`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchRounds(newPage);
    }
  };

  const getResultBadge = (result) => {
    const colors = {
      PASS: "bg-green-100 text-green-800",
      FAIL: "bg-red-100 text-red-800",
      UNDERVALUATION: "bg-orange-100 text-orange-800",
      PENDING: "bg-yellow-100 text-yellow-800",
    };
    return colors[result] || "bg-gray-100 text-gray-800";
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
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Application Rounds
                </h1>
                <p className="text-gray-600 text-lg">
                  Application #{id} • Total: {rounds.length} rounds
                  {applicationStatus && (
                    <span
                      className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        applicationStatus === "SHORTLISTED"
                          ? "bg-green-100 text-green-800"
                          : applicationStatus === "UNDERPROCESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : applicationStatus === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {applicationStatus}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {allowedUser() && canChangeStatus() && (
              <div className="flex items-center gap-3">
                <button
                  onClick={openStatusModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  Change Status
                </button>
                {isApplicationActive() && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Round
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {rounds.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
            <ClipboardList className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Rounds Found
            </h3>
            <p className="text-gray-600 text-lg">
              No rounds have been added for this application yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rounds
              .slice()
              .sort((a, b) => a.roundSequence - b.roundSequence)
              .map((round) => (
                <div
                  key={round.roundId}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                        {round.roundSequence}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {round.roundType.replace("_", " ")}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getResultBadge(
                            round.roundResult
                          )}`}
                        >
                          {round.roundResult}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(round.roundType === "TECHNICAL" ||
                        round.roundType === "HR") && (
                        <button
                          onClick={() => navigateToInterviews(round.roundId)}
                          className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="View Interviews"
                        >
                          <Video className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Interviews
                          </span>
                        </button>
                      )}

                      {allowedUser() && isApplicationActive() && (
                        <>
                          {round.roundResult === "PENDING" &&
                            isRoundCompleted(round) && (
                              <button
                                onClick={() => openPassForm(round.roundId)}
                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                title="Give Result"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}

                          {!isRoundCompleted(round) && (
                            <>
                              <button
                                onClick={() => handleEditRound(round)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Edit Round"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRound(round.roundId)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete Round"
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
                          {Array.isArray(round.roundDate)
                            ? `${round.roundDate[2]}/${round.roundDate[1]}/${round.roundDate[0]}`
                            : round.roundDate || "Not Set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500 text-xs">Time</p>
                        <p className="font-medium text-gray-900">
                          {Array.isArray(round.roundExpectedTime)
                            ? `${String(round.roundExpectedTime[0]).padStart(
                                2,
                                "0"
                              )}:${String(round.roundExpectedTime[1]).padStart(
                                2,
                                "0"
                              )}`
                            : round.roundExpectedTime || "Not Set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <BiStopwatch className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500 text-xs">Duration</p>
                        <p className="font-medium text-gray-900">
                          {round.roundDurationInMinutes
                            ? `${round.roundDurationInMinutes} mins`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <Star className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-500 text-xs">Rating</p>
                        <div className="flex items-center gap-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 fill-current ${
                                  i < (round.roundRating || 0)
                                    ? ""
                                    : "opacity-30"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({round.roundRating || 0}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {round.roundFeedback && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Feedback
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {round.roundFeedback}
                      </p>
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
                Add New Round
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Round Type *
                  </label>
                  <select
                    value={newRound.roundType}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundType: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {roundTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sequence
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRound.roundSequence}
                    onChange={(e) =>
                      setNewRound({
                        ...newRound,
                        roundSequence: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newRound.roundDate}
                    onChange={(e) =>
                      setNewRound({ ...newRound, roundDate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Time
                  </label>
                  <input
                    type="time"
                    value={newRound.roundExpectedTime}
                    onChange={(e) =>
                      setNewRound({
                        ...newRound,
                        roundExpectedTime: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newRound.roundDurationInMinutes}
                    onChange={(e) =>
                      setNewRound({
                        ...newRound,
                        roundDurationInMinutes: parseInt(e.target.value),
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
                  onClick={handleAddRound}
                  className="px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
                >
                  Add Round
                </button>
              </div>
            </div>
          </div>
        )}
        {editingRound && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Round
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sequence
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingRound.roundSequence}
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundSequence: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingRound.roundDurationInMinutes || ""}
                    onChange={(e) =>
                      setEditingRound({
                        ...editingRound,
                        roundDurationInMinutes: parseInt(e.target.value),
                      })
                    }
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
                  onClick={() => handleSaveRound(editingRound.roundId)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Change Application Status
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Status
                  </label>
                  <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
                    {applicationStatus || "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Status *
                  </label>
                  <select
                    value={statusFormData.applicationStatus}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        applicationStatus: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    {getAvailableStatusOptions().map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason / Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={statusFormData.applicationFeedback}
                    onChange={(e) =>
                      setStatusFormData({
                        ...statusFormData,
                        applicationFeedback: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter reason for status change..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
        {showPassForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Give Round Result
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Result *
                  </label>
                  <select
                    value={passFormData.roundResult}
                    onChange={(e) =>
                      setPassFormData({
                        ...passFormData,
                        roundResult: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="PASS">PASS</option>
                    <option value="FAIL">FAIL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={passFormData.roundRating}
                    onChange={(e) =>
                      setPassFormData({
                        ...passFormData,
                        roundRating: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback
                  </label>
                  <textarea
                    rows={3}
                    value={passFormData.roundFeedback}
                    onChange={(e) =>
                      setPassFormData({
                        ...passFormData,
                        roundFeedback: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Enter feedback..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowPassForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePassRound}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                >
                  Submit Result
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Rounds;
