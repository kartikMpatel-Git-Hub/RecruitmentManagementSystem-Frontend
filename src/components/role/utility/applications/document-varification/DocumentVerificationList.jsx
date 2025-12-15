import React, { useState } from 'react';
import { FileText, Eye, CheckCircle, Trash2, MessageSquare, X } from 'lucide-react';
import DocumentModal from './DocumentModal';

function DocumentVerificationList({
  documentVerifications,
  loading,
  filters,
  setFilters,
  finalizeVerification,
  reviewDocument,
  deleteDocument
}) {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleViewDocuments = (verification) => {
    setSelectedVerification(verification);
    setShowDocumentModal(true);
  };

  const handleCloseModal = () => {
    setShowDocumentModal(false);
    setSelectedVerification(null);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Verification</h1>
            <p className="text-gray-600 text-lg">Review and manage document verifications</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 0 }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
        {documentVerifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Document Verifications Found</h3>
            <p className="text-gray-600 text-lg">There are no document verifications at the moment.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Application ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Verified By</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Documents</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentVerifications.map((verification) => (
                <tr key={verification.documentVerificationId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">#{verification.documentVerificationId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">{verification.applicationId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(verification.verificationStatus)}`}>
                      {verification.verificationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{verification.verifiedBy || 'Not verified'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{verification.documents?.length || 0} documents</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewDocuments(verification)}
                        className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        title="View Documents"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          View Documents
                        </span>
                      </button>
                      {verification.verificationStatus !== 'APPROVED' && verification.verificationStatus !== 'REJECTED' && (
                        <button
                          onClick={() => finalizeVerification(verification.documentVerificationId)}
                          className="group relative p-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                          title="Finalize Verification"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Finalize Verification
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDocumentModal && selectedVerification && (
        <DocumentModal
          verification={selectedVerification}
          setSelectedVerification={setSelectedVerification}
          onClose={handleCloseModal}
          reviewDocument={reviewDocument}
          deleteDocument={deleteDocument}
        />
      )}
    </div>
  );
}

export default DocumentVerificationList;