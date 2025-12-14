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
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "../../Layout";
import ProfileModal from "../modal/ProfileModal";
import PositionModal from "../modal/PositionModal";
import { currencyCalculate } from "../../until/AmountCalculation";

const AllMappedApplications = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { positionId } = useParams("positionId");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [thresholdScore, setThresholdScore] = useState(50);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [candidateEducations, setCandidateEducations] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [position, setPosition] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [positionLoading, setPositionLoading] = useState(false);

  const fetchApplications = async () => {
    if (!positionId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/applications/mapped/position/${positionId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page, size: 20 },
        }
      );
      setApplications(
        response.data.data || response.data.content || response.data
      );
      setTotalPages(response.data.totalPages || 0);
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

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (app) => app.applicationStatus?.applicationStatus === statusFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicationId.toString().includes(searchTerm) ||
          app.candidateId.toString().includes(searchTerm)
      );
    }

    return filtered;
  };

  const openProfileModal = async (candidateId) => {
    setProfileLoading(true);
    setShowProfileModal(true);
    try {
      const [candidateResponse, educationResponse, skillsResponse] =
        await Promise.all([
          axios.get(`http://localhost:8080/candidates/${candidateId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          axios.get(
            `http://localhost:8080/candidate-educations/candidate/${candidateId}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          ),
          axios.get(
            `http://localhost:8080/candidate-skills/candidate/${candidateId}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          ),
        ]);
      setCandidateProfile(candidateResponse.data);
      setCandidateEducations(educationResponse.data.data || []);
      setCandidateSkills(skillsResponse.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load candidate profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setCandidateProfile(null);
    setCandidateEducations([]);
    setCandidateSkills([]);
  };

  const openPositionModal = async (positionId) => {
    if (!positionId) return;
    setPositionLoading(true);
    setShowPositionModal(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/positions/${positionId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setPosition(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load position");
    } finally {
      setPositionLoading(false);
    }
  };

  const closePositionModal = () => {
    setShowPositionModal(false);
    setPosition(null);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "on_hold":
        return <Pause className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
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

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-sm"
                  >
                    <option value="ALL">All Status</option>
                    <option value="MAPPED">Mapped</option>
                    <option value="PENDING">Pending</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ONHOLD">On Hold</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    placeholder="Search by Application ID or Candidate ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm"
                  />
                </div> */}
                <button
                  onClick={
                    ()=>navigate(`../${positionId}/applications`)
                  }
                  className="mx-3 inline-flex gap-2 px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                  <FileText className="w-5 h-5" />
                  View Applications
                </button>
                <button
                  onClick={
                    ()=>navigate(`../${positionId}/applications/shortlist`)
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
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">
                              #{app.candidateId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {app.matchingScore
                                ? `${app.matchingScore.toFixed(1)}%`
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
                              onClick={() => openProfileModal(app.candidateId)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Profile"
                            >
                              <User className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openPositionModal(app.positionId)}
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
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={page >= totalPages - 1}
                      className="px-3 py-1 text-sm border rounded-lg disabled:opacity-50"
                    >
                      Next
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

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          closeProfileModal={closeProfileModal}
          profileLoading={profileLoading}
          candidateProfile={candidateProfile}
          candidateSkills={candidateSkills}
          candidateEducations={candidateEducations}
        />
      )}

      {showPositionModal && (
        <PositionModal
          closePositionModal={closePositionModal}
          position={position}
          positionLoading={positionLoading}
          getStatusIcon={getStatusIcon}
          getStatusBadge={getStatusBadge}
          currencyCalculat={currencyCalculate}
        />
      )}
    </Layout>
  );
};

export default AllMappedApplications;
