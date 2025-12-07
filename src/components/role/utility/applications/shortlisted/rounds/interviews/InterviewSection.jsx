// src/components/Applications/shortlisted/InterviewSection/InterviewSection.jsx
import React, { useContext, useEffect, useState } from "react";
import { Video, Info, Plus } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../../../../context/AuthContext";
import { toast } from "react-toastify";

import AddInterviewModal from "./AddInterviewModel";
import EditInterviewModal from "./EditInterviewModal";
import ViewInterviewModal from "./ViewInterviewModel";

function InterviewSection({ app, round }) {
  const { authToken, userType } = useContext(AuthContext);

  const [interviews, setInterviews] = useState([]);
  const [interviewers, setInterviewers] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [viewingInterview, setViewingInterview] = useState(null);

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

  const allowedUser = () =>
    userType === "admin" || userType === "recruiter";

  const allowAction = () =>
    allowedUser() &&
    app.applicationStatus.applicationStatus !== "REJECTED" &&
    round.roundResult === "PENDING";

  const isInterviewCompleted = (interview) => {
    if (interview.interviewStatus?.toLowerCase() === "completed") return true;

    if (!interview.interviewDate || !interview.interviewEndTime) return false;

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
      await axios.put(
        `http://localhost:8080/interviews/complete/${interview.interviewId}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      console.error("Failed to complete interview:", error);
    }
  };

  const fetchInterviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/round/${round.roundId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setInterviews(response.data || []);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const url =
        round.roundType === "HR"
          ? "http://localhost:8080/users/hrs"
          : "http://localhost:8080/users/interviewers";

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInterviewers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch interviewers:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchInterviewers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.roundId, round.roundType]);

  const handleAddInterview = async () => {
    if (!authToken) return;

    try {
      await axios.post("http://localhost:8080/interviews/", newInterview, {
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
      console.error(error);
      toast.error(error.response?.data || "Failed to add interview");
    }
  };

  const handleEditInterview = (interview) => {
    const interviewerIds =
      interview.interviewers?.map((i) => i.interviewer?.userId) ||
      interview.interviewerIds ||
      [];

    setEditingInterview({
      ...interview,
      interviewerIds,
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
              <div className="flex items-center justify-between gap-3">
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

                  <div className="text-sm text-gray-600">
                    Interviewers:{" "}
                    {interview.interviewers?.length > 0
                      ? interview.interviewers
                          .map((i) => i.interviewer?.userName)
                          .filter(Boolean)
                          .join(", ")
                      : "Not assigned"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingInterview(interview)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    View
                  </button>

                  {allowAction() && !isInterviewCompleted(interview) && (
                    <>
                      <button
                        onClick={() => handleEditInterview(interview)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteInterview(interview.interviewId)
                        }
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm"
                      >
                        Delete
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

      {/* Modals */}
      <AddInterviewModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        newInterview={newInterview}
        setNewInterview={setNewInterview}
        onSubmit={handleAddInterview}
      />

      <EditInterviewModal
        editingInterview={editingInterview}
        setEditingInterview={setEditingInterview}
        onClose={() => setEditingInterview(null)}
        onSave={handleSaveInterview}
        interviewers={interviewers}
      />

      <ViewInterviewModal
        viewingInterview={viewingInterview}
        onClose={() => setViewingInterview(null)}
      />
    </div>
  );
}

export default InterviewSection;
