import React, { useContext, useEffect, useState } from "react";
import Layout from "../utility/Layout";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Video,
  Users,
  MessageSquare,
  ExternalLink,
  X,
  Eye,
  NutIcon,
} from "lucide-react";
import ShowInterview from "./ShowInterview";
import { toast } from "react-toastify";

function CandidateApplications() {
  const { authToken, profileData } = useContext(AuthContext);
  const navigator = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [expandedRound, setExpandedRound] = useState(null);
  const [selectedFile,setSelectedFile] = useState(null)
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [documentVerifications, setDocumentVerifications] = useState({});
  const [editingDocument, setEditingDocument] = useState(null);

  const fetchApplications = async () => {
    if (!profileData || !authToken) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/applications/candidate/${profileData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setApplications(response.data.data || []);
      // console.log(response.data.data);

      // Fetch document verifications for DOCUMENT_VERIFICATION status applications
      const docVerificationApps = response.data.data.filter(
        (app) =>
          app.applicationStatus.applicationStatus === "DOCUMENT_VERIFICATION"
      );

      for (const app of docVerificationApps) {
        fetchDocumentVerification(app.applicationId);
      }
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentVerification = async (applicationId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/document-verification/${applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setDocumentVerifications((prev) => ({
        ...prev,
        [applicationId]: response.data,
      }));
    } catch (error) {
      // console.log("Error fetching document verification:", error);
    }
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray)) {
      return `${String(dateArray[2]).padStart(2, "0")}/${String(
        dateArray[1]
      ).padStart(2, "0")}/${dateArray[0]}`;
    }
    return dateArray || "Not Set";
  };

  const formatTime = (timeArray) => {
    if (Array.isArray(timeArray)) {
      return `${String(timeArray[0]).padStart(2, "0")}:${String(
        timeArray[1]
      ).padStart(2, "0")}`;
    }
    return timeArray || "Not Set";
  };

  const handleDocumentUpload = async (applicationId, documentType) => {
    const file = selectedFile;
    if (!file) return;

    setUploadingDoc(`${applicationId}-${documentType}`);
    const formData = new FormData();
    formData.append("document", file);
    setUploadingDoc(applicationId)
    try {
      await axios.post(
        `http://localhost:8080/document-verification/${applicationId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSelectedFile(null)
      toast.success("Document Uploaded Successfully !")
      fetchDocumentVerification(applicationId);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Error uploading document. Please try again.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDocumentEdit = async (documentId, applicationId, file) => {
    if (!file) return;

    setUploadingDoc(documentId);
    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.put(
        `http://localhost:8080/document-verification/document/${documentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Document Edited Successfully !")
      setEditingDocument(null);
      fetchDocumentVerification(applicationId);
    } catch (error) {
      toast.error("Error updating document. Please try again.");
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleDeleteDocument = async (documentId, applicationId) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return
    }
    try {
      await axios.delete(
        `http://localhost:8080/document-verification/document/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Document Deleted Successfully !")
      fetchDocumentVerification(applicationId);
    } catch (error) {
      toast.error("Error updating document. Please try again.");
    }
  };

  const getDocumentStatusBadge = (status) => {
    const statusColors = {
      UPLOADED: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const shortlistedApps = applications.filter((app) => app.isShortlisted);
  const nonShortlistedApps = applications.filter((app) => !app.isShortlisted);

  const renderApplications = (apps, title, icon, bgColor) => {
    if (apps.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgColor} rounded-lg`}>{icon}</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">
              {apps.length} application(s)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="divide-y divide-gray-200">
            {apps.map((application) => (
              <div key={application.applicationId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-lg font-semibold text-gray-900">
                      App #{application.applicationId}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.applicationStatus.applicationStatus ===
                        "UNDERPROCESS"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.applicationStatus.applicationStatus ===
                            "ACCEPTED"
                          ? "bg-green-100 text-green-800"
                          : application.applicationStatus.applicationStatus ===
                            "DOCUMENT_VERIFICATION"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.applicationStatus.applicationStatus}
                    </span>
                    <div className="text-sm text-gray-600">
                      Position ID: {application.positionId}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rounds: {application.applicationRounds?.length || 0}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setExpandedApp(
                        expandedApp === application.applicationId
                          ? null
                          : application.applicationId
                      )
                    }
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                  >
                    Details
                    {expandedApp === application.applicationId ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {expandedApp === application.applicationId && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-900 mb-1">
                        Application Status
                      </h4>
                      <p className="text-sm text-blue-800">
                        {application.applicationStatus.applicationFeedback}
                      </p>
                    </div>

                    {application.applicationStatus.applicationStatus ===
                      "DOCUMENT_VERIFICATION" && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-900 mb-4 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Document Verification
                        </h4>

                        {/* Show uploaded documents */}
                        {documentVerifications[application.applicationId]
                          ?.documents?.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-yellow-900 mb-2">
                              Uploaded Documents:
                            </h5>
                            <div className="space-y-2">
                              {documentVerifications[
                                application.applicationId
                              ].documents.map((doc) => (
                                <div
                                  key={doc.documentId}
                                  className="bg-white p-3 rounded border border-yellow-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                          {doc.documentName}
                                        </span>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDocumentStatusBadge(
                                            doc.documentStatus
                                          )}`}
                                        >
                                          {doc.documentStatus}
                                        </span>
                                      </div>
                                      {doc.documentStatus === "REJECTED" && (
                                        <p className="text-xs text-red-600 mt-1">
                                          <strong>Rejection Reason:</strong>{" "}
                                          {doc.rejectionReason}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          window.open(doc.documentUrl, "_blank")
                                        }
                                        className="p-1 text-slate-600 hover:text-slate-800 transition-colors"
                                        title="View Document"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      {(doc.documentStatus === "REJECTED" ||
                                        doc.documentStatus === "UPLOADED") && (
                                        <button
                                          onClick={() =>
                                            setEditingDocument(doc.documentId)
                                          }
                                          className="px-2 py-1 text-xs bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
                                        >
                                          Edit
                                        </button>
                                      )}
                                      {(doc.documentStatus === "REJECTED" ||
                                        doc.documentStatus === "UPLOADED") && (
                                        <button
                                          onClick={() =>
                                            handleDeleteDocument(
                                              doc.documentId,
                                              application.applicationId
                                            )
                                          }
                                          className="px-2 py-1 text-xs bg-red-800 text-white rounded hover:bg-slate-700 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Edit document form */}
                                  {editingDocument === doc.documentId && (
                                    <div className="mt-3 pt-3 border-t border-yellow-200">
                                      {uploadingDoc === doc.documentId ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <div className="w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                                          <span>Uploading document...</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-3">
                                          <input
                                            type="file"
                                            onChange={(e) => {
                                              const file = e.target.files[0];
                                              if (file)
                                                handleDocumentEdit(
                                                  doc.documentId,
                                                  application.applicationId,
                                                  file
                                                );
                                            }}
                                            className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                          />
                                          <button
                                            onClick={() =>
                                              setEditingDocument(null)
                                            }
                                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Document Upload Fields */}
                        <div>
                          <p className="text-sm text-yellow-800 mb-3">
                            {documentVerifications[application.applicationId]?.documents?.length > 0 
                              ? 'Upload additional documents if required:' 
                              : 'Please upload your documents for verification to proceed with your application.'}
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              onChange={(e) => setSelectedFile(e.target.files[0])}
                              className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-800 file:text-white hover:file:bg-slate-700"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <button
                              onClick={() => handleDocumentUpload(application.applicationId)}
                              disabled={!selectedFile || uploadingDoc === application.applicationId}
                              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                              {uploadingDoc === application.applicationId ? 'Uploading...' : 'Upload Document'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.applicationRounds?.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          Interview Rounds
                        </h4>
                        <div className="space-y-4">
                          {application.applicationRounds.map((round) => (
                            <div
                              key={round.roundId}
                              className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                      <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-slate-900">
                                        Round {round.roundSequence}:{" "}
                                        {round.roundType}
                                      </h5>
                                      <p className="text-xs text-slate-600">
                                        {formatDate(round.roundDate)} •{" "}
                                        {formatTime(round.roundExpectedTime)} •{" "}
                                        {round.roundDurationInMinutes}m
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        round.roundResult === "PASS"
                                          ? "bg-green-100 text-green-800"
                                          : round.roundResult === "FAIL"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {round.roundResult}
                                    </span>
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm font-semibold text-gray-700">
                                        {round.roundRating}/5
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {round.roundInterviews?.length > 0 && (
                                  <button
                                    onClick={() =>
                                      setExpandedRound(
                                        expandedRound === round.roundId
                                          ? null
                                          : round.roundId
                                      )
                                    }
                                    className="inline-flex items-center gap-2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-slate-700 font-medium transition-colors"
                                  >
                                    <Video className="w-4 h-4" />
                                    {expandedRound === round.roundId
                                      ? "Hide"
                                      : "View"}{" "}
                                    Interviews ({round.roundInterviews.length})
                                  </button>
                                )}
                              </div>

                              {round.roundFeedback && (
                                <div className="bg-white p-3 rounded-lg border border-slate-200 mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-semibold text-slate-900">
                                      Round Feedback
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {round.roundFeedback}
                                  </p>
                                </div>
                              )}

                              {expandedRound === round.roundId &&
                                round.roundInterviews?.length > 0 && (
                                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                                    <h5 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                      <Video className="w-5 h-5 text-slate-600" />
                                      Scheduled Interviews (
                                      {round.roundInterviews.length})
                                    </h5>
                                    <div className="grid gap-3">
                                      {round.roundInterviews.map(
                                        (interview) => (
                                          <div
                                            key={interview.interviewId}
                                            className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-3"
                                          >
                                            <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-700 rounded-lg">
                                                  <Video className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                  <h6 className="font-semibold text-gray-900">
                                                    Interview #
                                                    {interview.interviewId}
                                                  </h6>
                                                  <p className="text-xs text-gray-600">
                                                    {formatDate(
                                                      interview.interviewDate
                                                    )}{" "}
                                                    •{" "}
                                                    {formatTime(
                                                      interview.interviewTime
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                      interview.interviewEndTime
                                                    )}
                                                  </p>
                                                </div>
                                                <span
                                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    interview.interviewStatus ===
                                                    "COMPLETED"
                                                      ? "bg-green-100 text-green-800"
                                                      : interview.interviewStatus ===
                                                        "SCHEDULED"
                                                      ? "bg-blue-100 text-blue-800"
                                                      : "bg-gray-100 text-gray-800"
                                                  }`}
                                                >
                                                  {interview.interviewStatus}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {interview.interviewLink && (
                                                  <a
                                                    href={
                                                      interview.interviewLink
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 font-medium"
                                                  >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Join Meeting
                                                  </a>
                                                )}
                                                <button
                                                  onClick={() =>
                                                    setSelectedInterview(
                                                      interview
                                                    )
                                                  }
                                                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs hover:bg-slate-200 font-medium"
                                                >
                                                  <Eye className="w-3 h-3" />
                                                  Details
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
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
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (!authToken || !profileData) navigator("/");
    fetchApplications();
  }, [authToken, profileData]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading applications...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Applications
            </h1>
            <p className="text-sm text-gray-600">
              Track your job applications and round progress
            </p>
          </div>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-8">
            {renderApplications(
              shortlistedApps,
              "Shortlisted Applications",
              <CheckCircle className="w-6 h-6 text-green-600" />,
              "bg-green-100"
            )}

            {renderApplications(
              nonShortlistedApps,
              "Other Applications",
              <XCircle className="w-6 h-6 text-gray-600" />,
              "bg-gray-100"
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-16 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Applications Found
            </h3>
            <p className="text-gray-600">
              You haven't submitted any applications yet.
            </p>
          </div>
        )}

        {selectedInterview && (
          <ShowInterview
            selectedInterview={selectedInterview}
            setSelectedInterview={setSelectedInterview}
            formatDate={formatDate}
            formatTime={formatTime}
            profileData={profileData}
          />
        )}
      </div>
    </Layout>
  );
}

export default CandidateApplications;
