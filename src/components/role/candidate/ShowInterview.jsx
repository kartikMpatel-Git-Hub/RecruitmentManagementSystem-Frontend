import { useState } from "react";
import {
  Calendar,
  Star,
  Video,
  Users,
  MessageSquare,
  ExternalLink,
  X,
  Eye,
} from "lucide-react";
function ShowInterview({selectedInterview,formatDate,formatTime,profileData,setSelectedInterview}) {
  const [expandedSkills, setExpandedSkills] = useState(null);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-lg">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  Interview #{selectedInterview.interviewId}
                </h3>
                <p className="text-slate-300 text-sm">
                  Detailed Interview Information
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedInterview(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-100px)]">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Interview Details
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Status</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        selectedInterview.interviewStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : selectedInterview.interviewStatus === "SCHEDULED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedInterview.interviewStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Date</span>
                    <span className="text-gray-900 font-semibold">
                      {formatDate(selectedInterview.interviewDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Time</span>
                    <span className="text-gray-900 font-semibold">
                      {formatTime(selectedInterview.interviewTime)} -{" "}
                      {formatTime(selectedInterview.interviewEndTime)}
                    </span>
                  </div>
                </div>
                {selectedInterview.interviewLink && (
                  <div className="mt-4">
                    <a
                      href={selectedInterview.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-lg hover:from-slate-800 hover:to-slate-900 font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5" />
                      Join Interview Meeting
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Application Info
                  </h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Round ID</span>
                    <span className="text-gray-900 font-semibold">
                      #{selectedInterview.roundId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">
                      Position ID
                    </span>
                    <span className="text-gray-900 font-semibold">
                      #{selectedInterview.positionId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">
                      Application ID
                    </span>
                    <span className="text-gray-900 font-semibold">
                      #{selectedInterview.applicationId}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium text-gray-700">Candidate</span>
                    <span className="text-gray-900 font-semibold">
                      {profileData?.userName || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {selectedInterview.interviewers?.length > 0 && (
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    Interviewers & Feedback
                  </h4>
                  <p className="text-sm text-slate-700">
                    {selectedInterview.interviewers.length} interviewer(s)
                  </p>
                </div>
              </div>

              <div className="grid gap-6">
                {selectedInterview.interviewers.map((interviewerObj) => {
                  const interviewer = interviewerObj.interviewer;
                  const feedback = interviewerObj.interviewerFeedback;
                  return (
                    <div
                      key={interviewerObj.interviewInterviewerId}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <img
                            src={interviewer.userImageUrl}
                            alt={interviewer.userName}
                            className="w-16 h-16 rounded-full border-4 border-slate-200 shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-600 rounded-full border-2 border-white flex items-center justify-center">
                            <Users className="w-3 h-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-lg font-bold text-gray-900">
                            {interviewer.userName}
                          </h5>
                          <p className="text-gray-600">
                            {interviewer.userEmail}
                          </p>
                          <p className="text-sm text-slate-600 font-medium">
                            ID: #{interviewer.userId}
                          </p>
                        </div>
                      </div>

                      {feedback && (
                        <div className="space-y-4">
                          {feedback.interviewFeedback && (
                            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-5 h-5 text-slate-600" />
                                <span className="font-semibold text-slate-900">
                                  Overall Feedback
                                </span>
                              </div>
                              <p className="text-gray-800 leading-relaxed">
                                {feedback.interviewFeedback}
                              </p>
                            </div>
                          )}

                          {feedback.skillRatings?.length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="font-semibold text-slate-900 flex items-center gap-2">
                                  <Star className="w-5 h-5 text-slate-600" />
                                  Skill Ratings ({feedback.skillRatings.length})
                                </h6>
                                <button
                                  onClick={() =>
                                    setExpandedSkills(
                                      expandedSkills ===
                                        interviewerObj.interviewInterviewerId
                                        ? null
                                        : interviewerObj.interviewInterviewerId
                                    )
                                  }
                                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs hover:bg-slate-200"
                                >
                                  <Eye className="w-3 h-3" />
                                  {expandedSkills ===
                                  interviewerObj.interviewInterviewerId
                                    ? "Hide"
                                    : "View"}
                                </button>
                              </div>
                              {expandedSkills ===
                                interviewerObj.interviewInterviewerId && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {feedback.skillRatings.map((skillRating) => (
                                    <div
                                      key={skillRating.skillRatingId}
                                      className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900">
                                          {skillRating.skill?.skill}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`w-4 h-4 fill-current ${
                                                  i < skillRating.skillRating
                                                    ? ""
                                                    : "opacity-30"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          <span className="text-sm font-bold text-gray-700">
                                            ({skillRating.skillRating}
                                            /5)
                                          </span>
                                        </div>
                                      </div>
                                      {skillRating.skillFeedback && (
                                        <p className="text-sm text-gray-700 mt-2 italic">
                                          {skillRating.skillFeedback}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowInterview;
