import axios from "axios";
import { Users, Trash2, Power, PowerOff, Eye, User, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

function CandidateList({ candidates, onUpdate, onDelete, onView, pagination, onPageChange }) {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = () => {
    setShowResumeModal(true);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);
    
    try {
      const response = await axios.post(`http://localhost:8080/candidates/resume-entry`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        
      })
      console.log(response);
      alert('Resume uploaded successfully!');
      setShowResumeModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(
        error?.response?.data || "Resume upload failed!",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setUploading(false);
    }
  };
  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Candidate Management
                </h1>
                <p className="text-gray-600 text-lg">
                  View and manage all system candidates
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleResumeUpload}
            className="mt-6 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-800 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Add Using Resume
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        {candidates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Candidates Found
            </h3>
            <p className="text-gray-600 text-lg">
              There are no candidates in the system at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {candidates.map((candidate) => {
              const {
                userId,
                userName,
                userEmail,
                role,
                userImageUrl,
                userEnabled,
              } = candidate;
              return (
                <div
                  key={userId}
                  className="bg-white rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt="User"
                        className="w-full h-full rounded-full object-cover border-4 border-slate-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                    {userEmail}
                  </p>

                  <div className="flex flex-col items-center space-y-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                        role.role
                      )}`}
                    >
                      {role.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userEnabled ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => onView(userId)}
                      className="flex items-center justify-center w-full px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="text-xs">View</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdate(!userEnabled, userId)}
                        className={`flex items-center justify-center flex-1 px-3 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                          userEnabled
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {userEnabled ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(userId)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages >= 1 && (
          <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
              {Math.min(
                (pagination.currentPage + 1) * pagination.pageSize,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} candidates
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.last}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Resume
              </h3>
              <button
                onClick={() => {
                  setShowResumeModal(false);
                  setSelectedFile(null);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resume File
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                  accept=".pdf,.doc,.docx"
                />
                {selectedFile && (
                  <p className="text-xs text-gray-600 mt-1">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Resume
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowResumeModal(false);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateList;
