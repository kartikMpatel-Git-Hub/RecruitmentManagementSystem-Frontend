import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import {
  Users,
  Star,
  Eye,
  UserCheck,
  Search,
  Filter,
  Target,
  X,
  User,
  Briefcase,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "../../Layout";
import ProfileModal from "../modal/ProfileModal";
import PositionModal from "../modal/PositionModal";
import { currencyCalculate } from "../../until/AmountCalculation";

const AllMappedApplications = () => {
  const { authToken, userType } = useContext(AuthContext);
  const navigate = useNavigate();
  const { positionId } = useParams("positionId");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20;
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [thresholdScore, setThresholdScore] = useState(50);

  const handleOpenProfile = (candidateId) => {
    if (candidateId)
      navigate(`/${userType}/candidates/${candidateId}?page=profile`);
  };
  const handleOpenPosition = (positionId) => {
    if (positionId) navigate(`/${userType}/positions/${positionId}`);
  };

  const fetchApplications = async () => {
    if (!positionId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/applications/mapped/position/${positionId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page, size: pageSize },
        }
      );
      setApplications(
        response.data.data || response.data.content || response.data
      );
      setTotalPages(response.data.totalPages || 0);
      setTotalItems(
        response.data.totalItems || response.data.totalElements || 0
      );
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const findMatches = async () => {
    if (!positionId) return;
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:8080/applications/mapped/position/${positionId}`,
        { thresholdScore },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success(response.data);
      fetchApplications();
    } catch (error) {
      console.error("Error finding matches:", error);
      toast.error(error.response.data.message);
    } finally {
      setShowThresholdModal(false);
      setLoading(false);
    }
  };

  const shortlistApplication = async (applicationId) => {
    try {
      await axios.patch(
        `http://localhost:8080/applications/${applicationId}/shortlist`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Application shortlisted successfully!");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to shortlist application");
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case "SHORTLISTED":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "REJECTED":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "PENDING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "ONHOLD":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;
    return filtered;
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    if (!positionId) {
      toast.error("Position ID is required");
      return navigate(-1);
    }
    fetchApplications();
  }, [positionId, page, authToken]);

  const ApplicationsContent = () => (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Mapped Applications
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Position ID: {positionId} •{" "}
                    {getFilteredApplications().length} applications
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(`../${positionId}/applications`)}
                  className="mx-3 inline-flex gap-2 px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <FileText className="w-5 h-5" />
                  View Applications
                </button>
                <button
                  onClick={() =>
                    navigate(`../${positionId}/applications/shortlist`)
                  }
                  className="mx-3 inline-flex gap-2 px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <UserCheck className="w-5 h-5" />
                  View Shortlists
                </button>
                <button
                  onClick={() => setShowThresholdModal(true)}
                  className="mx-3 inline-flex gap-2 px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Target className="w-5 h-5" />
                  Find Matches
                </button>
              </div>
            </div>
          </div>

          {getFilteredApplications().length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Applications Found
              </h3>
              <p className="text-gray-600">
                No mapped applications match your current filters.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Application ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Candidate
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Matching Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Shortlisted
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredApplications().map((app) => (
                      <tr
                        key={app.applicationId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{app.applicationId}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleOpenProfile(app.candidateId)}
                            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors group"
                          >
                            <User className="w-4 h-4" />
                            <span>Candidate #{app.candidateId}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-slate-600 to-slate-800 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    app.matchScore || 0,
                                    100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {app.matchScore
                                ? `${app.matchScore.toFixed(0)}%`
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={getStatusBadge(
                              app.applicationStatus?.applicationStatus
                            )}
                          >
                            {app.applicationStatus?.applicationStatus ||
                              "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              app.isShortlisted
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {app.isShortlisted ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleOpenProfile(app.candidateId)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Profile"
                            >
                              <User className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenPosition(app.positionId)}
                              className="p-1 text-yellow-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Position"
                            >
                              <Briefcase className="w-4 h-4" />
                            </button>
                            <div className="">
                              {!app.isShortlisted &&
                                app.applicationStatus?.applicationStatus !==
                                  "REJECTED" && (
                                  <button
                                    onClick={() =>
                                      shortlistApplication(app.applicationId)
                                    }
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Shortlist"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </button>
                                )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages >= 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing {page * pageSize + 1} to{" "}
                    {Math.min((page + 1) * pageSize, totalItems)} of{" "}
                    {totalItems} applications
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Page {page + 1} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <ApplicationsContent />

      {/* Threshold Modal */}
      {showThresholdModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowThresholdModal(false)}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 -m-6 mb-6 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    Set Matching Threshold
                  </h3>
                  <button
                    onClick={() => setShowThresholdModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Threshold Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={thresholdScore}
                  onChange={(e) =>
                    setThresholdScore(parseInt(e.target.value) || 50)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-medium text-center bg-slate-50 focus:bg-white focus:border-slate-500 transition-colors"
                  placeholder="50"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Applications with matching score above this threshold will be
                  included.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowThresholdModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={findMatches}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 disabled:opacity-50 transition-all font-medium shadow-lg"
                >
                  {loading ? "Finding..." : "Find Matches"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AllMappedApplications;
