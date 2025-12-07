import React from 'react'
import { X } from "lucide-react";

function HoldStatusModal({
    closeHoldStatus,
    editHoldStatus,
    handleHoldStatus,
    setEditHoldStatus
}) {
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeHoldStatus}
        ></div>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Hold Application
                </h3>
                <button
                  onClick={closeHoldStatus}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={(e) => handleHoldStatus(e)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Feedback
                  </label>
                  <textarea
                    name="applicationFeedback"
                    value={editHoldStatus?.holdReason || ""}
                    onChange={(e)=>setEditHoldStatus({...editHoldStatus, holdReason: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white resize-none"
                    rows="4"
                    placeholder="Enter feedback for the candidate..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={closeHoldStatus}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold shadow-lg"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HoldStatusModal