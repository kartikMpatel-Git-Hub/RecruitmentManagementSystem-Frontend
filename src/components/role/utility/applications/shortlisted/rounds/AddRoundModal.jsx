// src/components/Applications/shortlisted/RoundSection/AddRoundModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { Plus, X, Save } from "lucide-react";

function AddRoundModal({
  isOpen,
  onClose,
  newRound,
  setNewRound,
  maxSequence,
  roundTypes,
  onSubmit,
}) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-6 h-6 text-green-600" />
              Add New Round
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold">
                  Round Sequence
                </label>
                <input
                  type="number"
                  min={1}
                  max={maxSequence}
                  value={newRound.roundSequence}
                  onChange={(e) =>
                    setNewRound({
                      ...newRound,
                      roundSequence: parseInt(e.target.value || "1", 10),
                    })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Round Type
                </label>
                <select
                  value={newRound.roundType}
                  onChange={(e) =>
                    setNewRound({ ...newRound, roundType: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                >
                  <option value="">Select Round Type</option>
                  {roundTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold">
                  Round Date
                </label>
                <input
                  type="date"
                  value={newRound.roundDate || ""}
                  onChange={(e) =>
                    setNewRound({ ...newRound, roundDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Round Time
                </label>
                <input
                  type="time"
                  value={newRound.roundExpectedTime || ""}
                  onChange={(e) =>
                    setNewRound({
                      ...newRound,
                      roundExpectedTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newRound.roundDurationInMinutes || ""}
                onChange={(e) =>
                  setNewRound({
                    ...newRound,
                    roundDurationInMinutes: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={onSubmit}
              disabled={
                !newRound.roundType ||
                !newRound.roundDate ||
                !newRound.roundExpectedTime ||
                !newRound.roundDurationInMinutes
              }
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Add Round
            </button>

            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddRoundModal;
