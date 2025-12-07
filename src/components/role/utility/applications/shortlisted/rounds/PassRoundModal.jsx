// src/components/Applications/shortlisted/RoundSection/PassRoundModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Star, X } from "lucide-react";

function PassRoundModal({ isOpen, onClose, passFormData, setPassFormData, onSubmit }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Round Result</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Round Result
              </label>
              <select
                value={passFormData.roundResult}
                onChange={(e) =>
                  setPassFormData({
                    ...passFormData,
                    roundResult: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              >
                <option value="PASS">PASS</option>
                <option value="FAIL">FAIL</option>
                <option value="UNDERVALUATION">UNDERVALUATION</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Round Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setPassFormData({
                          ...passFormData,
                          roundRating: star.toString(),
                        })
                      }
                      className={`p-1 ${
                        star <= parseInt(passFormData.roundRating || 0, 10)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {passFormData.roundRating || 0}/5
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Round Feedback
              </label>
              <textarea
                rows={4}
                value={passFormData.roundFeedback}
                onChange={(e) =>
                  setPassFormData({
                    ...passFormData,
                    roundFeedback: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 resize-none"
                placeholder="Enter feedback"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-xl hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!passFormData.roundRating || !passFormData.roundFeedback}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PassRoundModal;
