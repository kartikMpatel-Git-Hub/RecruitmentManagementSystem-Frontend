// src/components/Applications/shortlisted/InterviewSection/ViewInterviewModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Video, X } from "lucide-react";

function ViewInterviewModal({ viewingInterview, onClose }) {
  if (!viewingInterview) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Video className="w-6 h-6 text-purple-600" />
                  Interview Details #{viewingInterview.interviewId}
                </h3>
                <button
                  onClick={onClose}
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
                {viewingInterview.interviewers?.map((interviewerObj) => {
                  const interviewer = interviewerObj.interviewer;
                  const feedback = interviewerObj.interviewerFeedback;
                  if (!interviewer) return null;

                  return (
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
                                {feedback.skillRatings.map((skillRating) => (
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
                                                i < skillRating.skillRating
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
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ViewInterviewModal;
