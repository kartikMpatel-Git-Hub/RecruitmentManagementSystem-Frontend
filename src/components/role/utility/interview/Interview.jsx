import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import {
  Video,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  MessageSquare,
  Filter,
  Search,
} from "lucide-react";
import InterviewerLayout from "../../interviewer/InterviewerLayout";

function Interview() {
  const { profileData, userType, authToken } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigator = useNavigate();

  const fetchInterviews = async () => {
    if (!authToken || !profileData.userId) return navigator("/login");
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/interviewer/${profileData.userId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = response.data.data || [];
      setInterviews(data);
      setFilteredInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  useEffect(() => {
    let filtered = interviews;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (interview) => interview.interviewStatus === statusFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((interview) =>
        interview.interviewId.toString().includes(searchTerm)
      );
    }

    setFilteredInterviews(filtered);
  }, [interviews, statusFilter, searchTerm]);

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray)) {
      return `${String(dateArray[2]).padStart(2, "0")}/${String(
        dateArray[1]
      ).padStart(2, "0")}/${dateArray[0]}`;
    }
    return dateArray || "Not Set";
  };

  const formatTime = (timeArray) => {
    if (Array.isArray(timeArray)) {
      return `${String(timeArray[0]).padStart(2, "0")}:${String(
        timeArray[1]
      ).padStart(2, "0")}`;
    }
    return timeArray || "Not Set";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isInterviewCompleted = (interview) => {
    if (interview.interviewStatus?.toLowerCase() === "completed") 
      return true;
    
    const now = new Date();
    const interviewDate = Array.isArray(interview.interviewDate) 
      ? new Date(interview.interviewDate[0], interview.interviewDate[1] - 1, interview.interviewDate[2])
      : new Date(interview.interviewDate);
    
    const interviewEndTime = Array.isArray(interview.interviewEndTime)
      ? new Date(interviewDate.getFullYear(), interviewDate.getMonth(), interviewDate.getDate(), interview.interviewEndTime[0], interview.interviewEndTime[1])
      : new Date(`${interviewDate.toDateString()} ${interview.interviewEndTime}`);
    
    return now > interviewEndTime;
  };

  return (
    <InterviewerLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Interviews
              </h1>
              <p className="text-sm text-gray-600">
                Manage your scheduled interviews
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredInterviews.length} interviews
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Interview ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interviews Grid */}
        {filteredInterviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        Interview #{interview.interviewId}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        getStatusColor(interview.interviewStatus)
                      }`}
                    >
                      {interview.interviewStatus}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {formatDate(interview.localDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Time: {formatTime(interview.interviewTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        Interviewers: {interview.interviewers?.length || 0}
                      </span>
                    </div>
                  </div>

                  {/* Interviewers */}
                  {interview.interviewers?.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-medium text-gray-700 mb-2">
                        Interviewers:
                      </div>
                      <div className="space-y-1">
                        {interview.interviewers.map((interviewerObj, index) => {
                          const interviewer = interviewerObj.interviewer;
                          return interviewer ? (
                            <div
                              key={interviewer.userId}
                              className="flex items-center gap-2"
                            >
                              <img
                                src={interviewer.userImageUrl}
                                alt={interviewer.userName}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-xs text-gray-600">
                                {interviewer.userName}
                              </span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {interview.interviewers?.[0]?.interviewerFeedback
                    ?.interviewFeedback && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">
                          Feedback:
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        {interview.interviewers[0].interviewerFeedback
                          .interviewFeedback}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator(`/interviewer/interviews/${interview.interviewId}/details`)}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <Users className="w-4 h-4" />
                        View Details
                      </button>
                      {isInterviewCompleted(interview) && (
                        <button
                          onClick={() => navigator(`/interviewer/${profileData.userId}/interviews/${interview.interviewId}/feedback`)}
                          className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Feedback
                        </button>
                      )}
                    </div>
                    {interview.interviewLink && (
                      <a
                        href={interview.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Join Interview
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No interviews found
            </h3>
            <p className="text-gray-600">
              {statusFilter !== "ALL" || searchTerm
                ? "Try adjusting your filters"
                : "You don't have any interviews scheduled yet"}
            </p>
          </div>
        )}
      </div>
    </InterviewerLayout>
  );
}

export default Interview;
