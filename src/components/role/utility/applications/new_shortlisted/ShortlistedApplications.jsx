import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import {
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Eye,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import Layout from "../../Layout";

function ShortlistedApplications() {
  const navigate = useNavigate();
  const { authToken, userType } = useContext(AuthContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const fetchShortlistedApplications = async (page = 0) => {
    let url = "";
    if (userType === "recruiter")
      url = `http://localhost:8080/applications/shortlists/recruiter`;
    else if (userType === "reviewer")
      url = `http://localhost:8080/applications/shortlists/reviewer`;
    else url = `http://localhost:8080/applications/shortlists`;

    try {
      setLoading(true);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, size: pagination.pageSize },
      });

      const { data, currentPage, pageSize, totalItems, totalPages, last } =
        response.data;
      setApplications(data || []);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching shortlisted applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchShortlistedApplications();
  }, [authToken, navigate]);

  const getStatusBadge = (status) => {
    const statusColors = {
      UNDERPROCESS: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-blue-100 text-blue-800",
      ONHOLD: "bg-purple-100 text-purple-800",
      SHORTLISTED: "bg-emerald-100 text-emerald-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchShortlistedApplications(newPage);
    }
  };

  const navigateToCandidate = (candidateId) => {
    navigate(
      `/${userType.toLowerCase()}/candidates/${candidateId}?page=profile`
    );
  };

  const navigateToPosition = (positionId) => {
    navigate(`/${userType.toLowerCase()}/positions/${positionId}`);
  };

  const navigateToRounds = (applicationId) => {
    navigate(`./${applicationId}/rounds`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shortlisted Applications
              </h1>
              <p className="text-gray-600 text-lg">
                Total: {pagination.totalItems} applications
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
            <Star className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Shortlisted Applications
            </h3>
            <p className="text-gray-600 text-lg">
              No candidates have been shortlisted yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Application ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Candidate
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Matching Score
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr
                      key={app.applicationId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          #{app.applicationId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigateToCandidate(app.candidateId)}
                          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors group"
                        >
                          <User className="w-4 h-4" />
                          <span>Candidate #{app.candidateId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigateToPosition(app.positionId)}
                          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 font-medium transition-colors group"
                        >
                          <Briefcase className="w-4 h-4" />
                          <span>Position #{app.positionId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            app.applicationStatus?.applicationStatus
                          )}`}
                        >
                          {app.applicationStatus?.applicationStatus || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-slate-600 to-slate-800 h-2 rounded-full"
                              style={{
                                width: `${Math.min(app.matchScore || 0, 100)}%`,
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
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigateToCandidate(app.candidateId)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Candidate Profile"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigateToPosition(app.positionId)}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            title="View Position Details"
                          >
                            <Briefcase className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigateToRounds(app.applicationId)}
                            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                            title="View Application Rounds"
                          >
                            <ClipboardList className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages >= 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600">
                  Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
                  {Math.min(
                    (pagination.currentPage + 1) * pagination.pageSize,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} applications
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.last}
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
    </Layout>
  );
}

export default ShortlistedApplications;
