// src/components/Applications/shortlisted/InterviewSection/AddInterviewModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Plus, Save, X } from "lucide-react";

function AddInterviewModal({
  isOpen,
  onClose,
  newInterview,
  setNewInterview,
  onSubmit,
}) {
  if (!isOpen) return null;

  const disabled =
    !newInterview.numberOfInterviewers ||
    !newInterview.interviewLink ||
    !newInterview.interviewDate ||
    !newInterview.interviewTime ||
    !newInterview.interviewEndTime;

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
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                Add New Interview
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
                onClick={onSubmit}
                disabled={disabled}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Add Interview
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddInterviewModal;
