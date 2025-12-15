import React, { useState } from "react";
import {
  X,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  MessageSquare,
  Eye,
} from "lucide-react";

function DocumentModal({
  verification,
  setSelectedVerification,
  onClose,
  reviewDocument,
  deleteDocument,
}) {
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewData, setReviewData] = useState({
    documentStatus: "",
    rejectionReason: "",
  });

  const getDocumentStatusBadge = (status) => {
    const statusColors = {
      UPLOADED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const handleReviewSubmit = (documentId) => {
    if (!reviewData.documentStatus) return;
    // console.log(reviewData);

    if (
      reviewDocument(
        documentId,
        reviewData.documentStatus,
        reviewData.rejectionReason
      )
    ) {
      setSelectedVerification((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          documents: prev.documents.map((doc) =>
            doc.documentId === documentId
              ? {
                  ...doc,
                  documentStatus: reviewData.documentStatus,
                  rejectionReason: reviewData.rejectionReason || "",
                }
              : doc
          ),
        };
      });

      setSelectedDocument(null);
      setReviewData({ documentStatus: "", rejectionReason: "" });
    }
  };

  const handleDeleteDocument = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      if(deleteDocument(documentId)){
        setSelectedVerification((prev) => {
          if (!prev) return prev;
  
          return {
          ...prev,
          documents: prev.documents.filter((doc) => doc.documentId !== documentId),
        };
        });
      }
    }
  };

  const handleSelectedDocument = (document) => {
    setSelectedDocument(document);
    setReviewData({
      documentStatus: document.documentStatus || "",
      rejectionReason: document.rejectionReason || "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Documents for Application #{verification.applicationId}
              </h2>
              <p className="text-gray-600">
                Verification ID: {verification.documentVerificationId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {verification.documents?.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-gray-500 text-lg">No documents uploaded</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verification.documents.map((document) => (
                <div
                  key={document.documentId}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {document.documentName}
                      </h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDocumentStatusBadge(
                            document.documentStatus
                          )}`}
                        >
                          {document.documentStatus}
                        </span>
                        <span className="text-gray-600 text-sm">
                          ID: {document.documentId}
                        </span>
                      </div>
                      {document.documentStatus === "REJECTED" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                          <p className="text-red-800 text-sm">
                            <strong>Rejection Reason:</strong>{" "}
                            {document.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <a
                        href={document.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          View Document
                        </span>
                      </a>
                      <button
                        onClick={() => handleSelectedDocument(document)}
                        className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="Review Document"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Review Document
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteDocument(document.documentId)
                        }
                        className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Delete Document
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Review Document
                </h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document: {selectedDocument.documentName}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={reviewData.documentStatus}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        documentStatus: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {reviewData.documentStatus === "REJECTED" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason
                    </label>
                    <textarea
                      value={reviewData.rejectionReason}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          rejectionReason: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      rows="3"
                      placeholder="Enter rejection reason..."
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      handleReviewSubmit(selectedDocument.documentId)
                    }
                    disabled={!reviewData.documentStatus}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Review
                  </button>
                  <button
                    onClick={() => setSelectedDocument(null)}
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
    </div>
  );
}

export default DocumentModal;
