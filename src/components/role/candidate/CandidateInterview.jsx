import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Star,
  MessageSquare,
  ExternalLink,
  X,
  Eye,
} from "lucide-react";
import CandidateLayout from "../utility/Layout";
import Layout from "../utility/Layout";
import ShowInterview from "./ShowInterview";

function CandidateInterview() {
  const { profileData, authToken } = useContext(AuthContext);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const fetchCandidateInterview = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/candidate/${profileData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setInterviews(response.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!authToken || !profileData) return;
    fetchCandidateInterview();
  }, [profileData, authToken]);

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading interviews...</div>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
            <p className="text-sm text-gray-600">
              View your scheduled and completed interviews
            </p>
          </div>
        </div>

        {interviews.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <div key={interview.interviewId} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-lg font-semibold text-gray-900">
                        #{interview.interviewId}
                      </div>
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
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(interview.interviewDate)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(interview.interviewTime)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {interview.interviewers?.length || 0}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {interview.interviewLink && (
                        <a
                          href={interview.interviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-slate-800 text-white px-3 py-1 rounded text-sm hover:bg-slate-700"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Join
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedInterview(interview)}
                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                      >
                        <Eye className="w-3 h-3" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-16 text-center">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Interviews Found
            </h3>
            <p className="text-gray-600">
              You don't have any interviews scheduled yet.
            </p>
          </div>
        )}
        {selectedInterview && (
          <ShowInterview selectedInterview={selectedInterview} setSelectedInterview={setSelectedInterview} formatDate={formatDate} formatTime={formatTime} profileData={profileData}/>
        )}
      </div>
    </Layout>
  );
}

export default CandidateInterview;
