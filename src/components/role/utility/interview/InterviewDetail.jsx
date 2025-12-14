import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import InterviewerLayout from "../../interviewer/InterviewerLayout";
import axios from "axios";
import {
  Video,
  Calendar,
  Clock,
  User,
  MapPin,
  Briefcase,
  Users,
  Eye,
} from "lucide-react";

function InterviewDetail() {
  const { authToken, userType ,profileData} = useContext(AuthContext);
  const navigate = useNavigate();
  const { interviewId } = useParams();
  const [basePath, setBasePath] = useState("");
  const fetchBasePath = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin/")) {
      setBasePath("/admin");
    } else if (currentPath.includes("/recruiter/")) {
      setBasePath("/recruiter");
    } else if (currentPath.includes("/reviewer/")) {
      setBasePath("/reviewer");
    } else if (currentPath.includes("/interviewer/")) {
      setBasePath("/interviewer");
    } else if (currentPath.includes("/hr/")) {
      setBasePath("/hr");
    } else {
      setBasePath("/");
    }
  };
  const [interview, setInterview] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchInterviewDetail = async () => {
    if (!interviewId || !authToken) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/${interviewId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const interviewData = response.data;
      setInterview(interviewData);

      // Fetch candidate details
      if (interviewData.candidateId) {
        const candidateResponse = await axios.get(
          `http://localhost:8080/candidates/${interviewData.candidateId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setCandidate(candidateResponse.data);
      }

      // Fetch position details
      if (interviewData.positionId) {
        const positionResponse = await axios.get(
          `http://localhost:8080/positions/${interviewData.positionId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setPosition(positionResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
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
    fetchInterviewDetail();
    fetchBasePath();
  }, [interviewId]);

  if (loading) {
    return (
      <InterviewerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            Loading interview details...
          </div>
        </div>
      </InterviewerLayout>
    );
  }

  return (
    <InterviewerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Video className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Interview Details #{interview?.interviewId}
            </h1>
            <p className="text-sm text-gray-600">
              Complete information about the interview
            </p>
          </div>
        </div>

        {/* Interview Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Interview Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-500" />
                {formatDate(interview?.interviewDate)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4 text-gray-500" />
                {formatTime(interview?.interviewTime)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4 text-gray-500" />
                {formatTime(interview?.interviewEndTime)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  interview?.interviewStatus === "SCHEDULED"
                    ? "bg-blue-100 text-blue-800"
                    : interview?.interviewStatus === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {interview?.interviewStatus}
              </span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Link
              </label>
              {interview?.interviewLink ? (
                <a
                  href={interview.interviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {interview.interviewLink}
                </a>
              ) : (
                <span className="text-gray-500">No link provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Information */}
        {candidate && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Candidate Information
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate(
                      `${basePath}/candidates/${candidate.candidateId}?page=applications`
                    );
                  }}
                  className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Full Detail
                </button>
                {candidate.candidateResumeUrl && (
                  <a
                    href={candidate.candidateResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Resume
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={candidate.userImageUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {candidate.candidateFirstName} {candidate.candidateLastName}
                </h3>
                <p className="text-gray-600">@{candidate.userName}</p>
                <p className="text-gray-600">{candidate.userEmail}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Gender</p>
                <p className="font-semibold text-gray-900">
                  {candidate.candidateGender || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="font-semibold text-gray-900">
                  {candidate.candidateTotalExperienceInYears || 0} Years
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Phone</p>
                <p className="font-semibold text-gray-900">
                  {candidate.candidatePhoneNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {candidate.candidateAddress}, {candidate.candidateZipCode},{" "}
                  {candidate.candidateCity}, {candidate.candidateCountry}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Position Information */}
        {position && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                Position Information
              </h2>
              <button
                onClick={() => {
                  navigate(`${basePath}/positions/${position.positionId}`);
                }}
                className="flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                View Full Detail
              </button>
            </div>
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-lg mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {position.positionTitle}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.positionLocation}
                    </span>
                    <span className="bg-white text-slate-800 px-2 py-1 rounded font-medium">
                      {position.positionType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {position.positionDescription && (
              <div className="bg-blue-50 rounded-lg p-4 my-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-700">{position.positionDescription}</p>
              </div>
            )}
            {position.positionCriteria && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Criteria</h4>
                <p className="text-gray-700">{position.positionCriteria}</p>
              </div>
            )}
          </div>
        )}

        {/* Interviewers & Feedback */}
        {interview?.interviewers?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Interviewers & Feedback
            </h2>
            <div className="space-y-6">
              {interview.interviewers.map((interviewerObj, index) => {
                const interviewer = interviewerObj.interviewer;
                console.log(interviewer);
                const feedback = interviewerObj.interviewerFeedback;
                return interviewer ? (
                  <div key={interviewer.userId} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={interviewer.userImageUrl}
                        alt={interviewer.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{interviewer.userName}</p>
                        <p className="text-sm text-gray-600">{interviewer.userEmail}</p>
                      </div>
                      {profileData.userId === interviewer.userId && interviewerObj.isFeedbackGiven &&(
                        <button
                          onClick={() => navigate(`/interviewer/${interviewer.userId}/interviews/${interview.interviewId}/feedback`)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Provide Feedback
                        </button>
                        // http://localhost:5173/interviewer/5/interviews/3/feedback
                      )}
                    </div>
                    
                    {interviewerObj.isFeedbackGiven && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Feedback</h4>
                        
                        {feedback.interviewFeedback && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-1">Overall Feedback:</p>
                            <p className="text-gray-600">{feedback.interviewFeedback}</p>
                          </div>
                        )}
                        
                        {feedback.skillRatings?.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Skill Ratings:</p>
                            <div className="space-y-2">
                              {feedback.skillRatings.map((skillRating) => (
                                <div key={skillRating.skillRatingId} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">{skillRating.skill?.skill}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < skillRating.skillRating ? "" : "opacity-30"}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">({skillRating.skillRating}/5)</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </InterviewerLayout>
  );
}

export default InterviewDetail;
