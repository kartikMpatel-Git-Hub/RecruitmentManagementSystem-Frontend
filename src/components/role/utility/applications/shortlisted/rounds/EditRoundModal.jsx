// src/components/Applications/shortlisted/RoundSection/EditRoundModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

function EditRoundModal({ editingRound, onClose, onSave, maxSequence }) {
  if (!editingRound) return null;

  const handleChange = (field, value) => {
    if (field === "roundSequence") {
      value = parseInt(value || "1", 10);
    }
    editingRound[field] = value;
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6">
          <div className="flex justify-between mb-6">
            <h3 className="text-2xl font-bold">Update Round</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
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
                  defaultValue={editingRound.roundSequence}
                  onChange={(e) =>
                    handleChange("roundSequence", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Round Type
                </label>
                <input
                  disabled
                  value={editingRound.roundType}
                  className="w-full px-4 py-3 border rounded-xl bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold">
                  Round Date
                </label>
                <input
                  type="date"
                  defaultValue={
                    Array.isArray(editingRound.roundDate)
                      ? `${editingRound.roundDate[0]}-${String(
                          editingRound.roundDate[1]
                        ).padStart(2, "0")}-${String(
                          editingRound.roundDate[2]
                        ).padStart(2, "0")}`
                      : editingRound.roundDate || ""
                  }
                  onChange={(e) => handleChange("roundDate", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Expected Time
                </label>
                <input
                  type="time"
                  defaultValue={
                    Array.isArray(editingRound.roundExpectedTime)
                      ? `${String(
                          editingRound.roundExpectedTime[0]
                        ).padStart(2, "0")}:${String(
                          editingRound.roundExpectedTime[1]
                        ).padStart(2, "0")}`
                      : editingRound.roundExpectedTime || ""
                  }
                  onChange={(e) =>
                    handleChange("roundExpectedTime", e.target.value)
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={editingRound.roundDurationInMinutes || ""}
                  onChange={(e) =>
                    handleChange(
                      "roundDurationInMinutes",
                      parseInt(e.target.value || "0", 10)
                    )
                  }
                  className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Round Feedback
              </label>
              <textarea
                rows={3}
                defaultValue={editingRound.roundStatus?.roundFeedback || ""}
                onChange={(e) => {
                  editingRound.roundStatus = {
                    ...(editingRound.roundStatus || {}),
                    roundFeedback: e.target.value,
                  };
                }}
                className="w-full px-4 py-3 border rounded-xl bg-gray-50"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={() => onSave(editingRound.roundId)}
                className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl"
              >
                Update Round
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default EditRoundModal;
