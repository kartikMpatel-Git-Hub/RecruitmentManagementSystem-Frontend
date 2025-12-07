// src/components/Applications/shortlisted/InterviewSection/EditInterviewModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

function EditInterviewModal({
  editingInterview,
  setEditingInterview,
  onClose,
  onSave,
  interviewers,
}) {
  if (!editingInterview) return null;

  const handleCheckboxChange = (userId, checked) => {
    const current = editingInterview.interviewerIds || [];
    setEditingInterview({
      ...editingInterview,
      interviewerIds: checked
        ? [...current, userId]
        : current.filter((id) => id !== userId),
    });
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Update Interview
              </h3>
              <button
                onClick={onClose}
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
                  value={editingInterview.interviewLink || ""}
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
                      ? `${String(editingInterview.interviewTime[0]).padStart(
                          2,
                          "0"
                        )}:${String(
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
                  {interviewers.map((interviewer) => (
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
                        onChange={(e) =>
                          handleCheckboxChange(
                            interviewer.userId,
                            e.target.checked
                          )
                        }
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
                    if (!updatedInterviewers[0]) {
                      updatedInterviewers[0] = {
                        interviewerFeedback: {},
                      };
                    }
                    updatedInterviewers[0] = {
                      ...updatedInterviewers[0],
                      interviewerFeedback: {
                        ...(updatedInterviewers[0].interviewerFeedback || {}),
                        interviewFeedback: e.target.value,
                      },
                    };
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
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(editingInterview.interviewId)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold shadow-lg"
              >
                Update Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EditInterviewModal;
