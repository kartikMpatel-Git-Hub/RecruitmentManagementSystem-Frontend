import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import {
  User,
  Eye,
  Download,
  Briefcase,
  ArrowLeft,
  Target,
  Users,
  Trash2,
  Plus,
  Edit,
  X,
  Info,
  Star,
  FileText,
  MapPin,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Languages,
  Wallet,
} from "lucide-react";
import Layout from "../Layout";
import { toast } from "react-toastify";
import { currencyCalculate } from "../until/AmountCalculation";

function AllApplications() {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [position, setPosition] = useState(null);
  const [candidateEducations, setCandidateEducations] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [positionLoading, setPositionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [statusForm, setStatusForm] = useState({
    positionId: "",
    currentStatus: "",
    applicationStatus: "",
    applicationFeedback: "",
  });

  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/applications`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchApplications();
  }, [authToken]);

  const getStatusBadge = (status) => {
    const statusColors = {
      UNDERPROCESS: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openStatusModal = useCallback((application) => {
    setSelectedApplication(application);
    setStatusForm({
      positionId: application.positionId,
      currentStatus: application.applicationStatus?.applicationStatus || "",
      applicationStatus: application.applicationStatus?.applicationStatus || "",
      applicationFeedback:
        application.applicationStatus?.applicationFeedback || "",
    });
    setShowStatusModal(true);
  }, []);

  const closeStatusModal = useCallback(() => {
    setShowStatusModal(false);
    setSelectedApplication(null);
    setStatusForm({ applicationStatus: "", applicationFeedback: "" });
  }, []);

  const handleStatusChange = useCallback((e) => {
    const { name, value } = e.target;
    setStatusForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleStatusUpdate = async (e, positionId) => {
    if (!positionId) return;
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/applications/${positionId}/application-status/${selectedApplication.applicationStatus.applicationStatusId}`,
        statusForm,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Application status updated successfully!");
      if (statusForm.applicationStatus === "ACCEPTED") {
        toast.success("Application Sortlist Successfully!");
      }
      fetchApplications();
      closeStatusModal();
    } catch (error) {
      toast.error("Failed to update application status");
    }
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
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);

      setPosition(response.data);
    } catch (error) {
      toast.error("Failed to load Position");
    } finally {
      setPositionLoading(false);
    }
  };

  const closePositionModal = () => {
    setShowPositionModal(false);
    setPosition(null);
  };

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return "N/A";
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
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
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                All Applications
              </h1>
              <p className="text-gray-600 text-lg">All Applications</p>
            </div>

            <button
              onClick={() => navigate("./shortlists")}
              className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
            >
              <Star className="w-4 h-4" />
              View Shortlists
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
            <User className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Applications Found
            </h3>
            <p className="text-gray-600 text-lg">
              No candidates have applied for this position yet.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-gray-600 text-lg">
                  <span className="font-bold text-gray-900">
                    {
                      applications.filter(
                        (app) =>
                          !statusFilter ||
                          app.applicationStatus?.applicationStatus ===
                            statusFilter
                      ).length
                    }
                  </span>{" "}
                  application
                  {applications.filter(
                    (app) =>
                      !statusFilter ||
                      app.applicationStatus?.applicationStatus === statusFilter
                  ).length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Filter by Status:
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white text-sm"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="UNDERPROCESS">Under Process</option>
                    <option value="ACCEPTED">Shortlisted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Index</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Position Id</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Candidate ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      Feedback
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications
                    .filter(
                      (app) =>
                        !statusFilter ||
                        app.applicationStatus?.applicationStatus ===
                          statusFilter
                    )
                    .map((app,index) => (
                      <tr
                        key={app.applicationId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4"><span className="font-semibold text-gray-900">#{index+1}</span></td>
                        <td className="px-6 py-4"><span className="font-semibold text-gray-900">{app.positionId}</span></td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-medium">
                            {app.candidateId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              app.applicationStatus?.applicationStatus
                            )}`}
                          >
                            {app.applicationStatus?.applicationStatus !==
                            "ACCEPTED"
                              ? app.applicationStatus?.applicationStatus
                              : "Shortlisted"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            {app.applicationStatus?.applicationFeedback ? (
                              <p
                                className="text-sm text-gray-600 truncate"
                                title={
                                  app.applicationStatus.applicationFeedback
                                }
                              >
                                {app.applicationStatus.applicationFeedback}
                              </p>
                            ) : (
                              <span className="text-sm text-gray-400">
                                No feedback
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="flex px-6 py-4 text-center">
                          <button
                            onClick={() => openPositionModal(app.positionId)}
                            className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Position
                          </button>
                          <button
                            onClick={() => openProfileModal(app.candidateId)}
                            className="m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          <button
                            onClick={() => openStatusModal(app)}
                            className={`m-1 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-sm`}
                          >
                            <Edit className="w-4 h-4" />
                            Change Status
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeStatusModal}
            ></div>
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Update Application Status
                    </h3>
                    <button
                      onClick={closeStatusModal}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <form onSubmit={handleStatusUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Application Status
                      </label>
                      <select
                        name="applicationStatus"
                        value={statusForm.applicationStatus}
                        disabled={statusForm.currentStatus === "ACCEPTED"}
                        onChange={handleStatusChange}
                        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white ${
                          statusForm.currentStatus === "ACCEPTED" &&
                          "opacity-50 cursor-not-allowed"
                        }`}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="UNDERPROCESS">Under Process</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Feedback
                      </label>
                      <textarea
                        name="applicationFeedback"
                        value={statusForm.applicationFeedback}
                        onChange={handleStatusChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white resize-none"
                        rows="4"
                        placeholder="Enter feedback for the candidate..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={closeStatusModal}
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
        )}

        {/* Candidate Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeProfileModal}
            ></div>
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {profileLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading candidate profile...
                    </p>
                  </div>
                ) : candidateProfile ? (
                  <div>
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center justify-between rounded-t-3xl">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            candidateProfile.userImageUrl ||
                            "/default-avatar.png"
                          }
                          alt="Profile"
                          className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {candidateProfile.candidateFirstName}{" "}
                            {candidateProfile.candidateLastName}
                          </h2>
                          <p className="text-slate-200">
                            @{candidateProfile.userName}
                          </p>
                          <p className="text-slate-200">
                            {candidateProfile.userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {candidateProfile.candidateResumeUrl && (
                          <a
                            href={candidateProfile.candidateResumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-slate-800 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            Resume
                          </a>
                        )}
                        <button
                          onClick={closeProfileModal}
                          className="p-2 hover:bg-slate-700 rounded-full"
                        >
                          <X className="w-6 h-6 text-white" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              First Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {candidateProfile.candidateFirstName ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Last Name
                            </p>
                            <p className="font-semibold text-gray-900">
                              {candidateProfile.candidateLastName ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Gender
                            </p>
                            <p className="font-semibold text-gray-900">
                              {candidateProfile.candidateGender ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              Experience
                            </p>
                            <p className="font-semibold text-gray-900">
                              {candidateProfile.candidateTotalExperienceInYears ||
                                0}{" "}
                              Years
                            </p>
                          </div>
                        </div>
                      </div>

                      {candidateSkills?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Skills
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {candidateSkills.map((skill, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-3 border"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {skill.skillName}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      skill.proficiencyLevel === "EXPERT"
                                        ? "bg-green-100 text-green-800"
                                        : skill.proficiencyLevel === "ADVANCED"
                                        ? "bg-blue-100 text-blue-800"
                                        : skill.proficiencyLevel ===
                                          "INTERMEDIATE"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {skill.proficiencyLevel}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600">
                                  {skill.yearsOfExperience} years experience
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {candidateEducations?.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-2xl">
                          <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Education
                          </h3>
                          <div className="space-y-4">
                            {candidateEducations.map((education, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-4 border border-l-4 border-l-blue-500"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      Degree
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {education.degreeName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      University
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {education.universityName}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      Percentage
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {education.percentage}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-600">
                                      Year
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {education.passingYear}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => {
                          const basePath = window.location.pathname.includes(
                            "/admin/"
                          )
                            ? "/admin"
                            : "/recruiter";
                          navigate(
                            `${basePath}/candidates/${candidateProfile.candidateId}?page=applications`
                          );
                        }}
                        className="flex py-5 px-8 m-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold shadow-lg"
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">Candidate profile not found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showPositionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-md"
              onClick={closePositionModal}
            ></div>
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-gray-200">
                {positionLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Position</p>
                  </div>
                ) : position ? (
                  <div className="flex flex-col h-full">
                    {/* Enhanced Header */}
                    <div className="bg-gradient-to-br bg-slate-800 text-white p-8 relative overflow-hidden">
                      <div className="absolute inset-0 "></div>
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30">
                            <Briefcase className="w-10 h-10" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                              {position.positionTitle}
                            </h2>
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                {getStatusIcon(position.positionStatus?.status)}
                                <span className="text-white font-medium">
                                  {position.positionStatus?.status || "Unknown"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-200">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {position.positionLocation || "Remote"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-gray-200">
                              <span className="flex">
                                <Wallet className="w-5 h-5 mr-1" /> ₹
                                {currencyCalculate(position.positionSalary) ||
                                  "N/A"}
                              </span>
                              <span className="flex">
                                <Languages className="w-5 h-5 mr-1" />{" "}
                                {position.positionLanguage || "N/A"}
                              </span>
                              <span className="bg-white text-slate-800 p-2 rounded-4xl font-bold">
                                {position.positionType.toLowerCase() || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={closePositionModal}
                          className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-200 border border-white/20"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="text-3xl font-bold text-slate-800 mb-2">
                            {position.positionTotalOpening || 0}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Total Openings
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {position.positionApplications || 0}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Applications
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            ₹
                            {currencyCalculate(position.positionSalary) ||
                              "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Annual Salary
                          </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {position.positionType || "N/A"}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Position Type
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="flex-1 px-8 py-6 overflow-y-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-xl">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              Job Description
                            </h3>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                              <p className="text-gray-700 leading-relaxed">
                                {position.positionDescription}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                              <div className="p-2 bg-green-100 rounded-xl">
                                <Target className="w-5 h-5 text-green-600" />
                              </div>
                              Requirements
                            </h3>
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                              <p className="text-gray-700 leading-relaxed">
                                {position.positionCriteria}
                              </p>
                            </div>
                          </div>

                          {/* {position.positionStatus?.status !== "OPEN" && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                              <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-xl">
                                  <Info className="w-5 h-5 text-red-600" />
                                </div>
                                Status Information
                              </h3>
                              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-5 border border-red-100">
                                <p className="text-red-700 leading-relaxed">
                                  {position.positionStatus.positionStatusReason}
                                </p>
                              </div>
                            </div>
                          )} */}
                        </div>
                      </div>

                      {/* Required Skills and Education */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Required Skills */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-xl">
                              <Users className="w-5 h-5 text-orange-600" />
                            </div>
                            Required Skills (
                            {position.positionRequirements?.length || 0})
                          </h3>
                          <div className="space-y-3">
                            {position.positionRequirements?.length > 0 ? (
                              <>
                                {position.positionRequirements
                                  .slice(0, 3)
                                  .map((req) => (
                                    <div
                                      key={req.positionRequirementId}
                                      className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100"
                                    >
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-900 text-sm">
                                          {req.positionSkill?.skill}
                                        </h4>
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            req.positionRequirement?.toLowerCase() ===
                                            "mandatory"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-blue-100 text-blue-800"
                                          }`}
                                        >
                                          {req.positionRequirement}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                {position.positionRequirements.length > 3 && (
                                  <div className="text-center py-2">
                                    <span className="text-sm text-gray-500">
                                      +
                                      {position.positionRequirements.length - 3}{" "}
                                      more skills
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">
                                  No skills specified
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Required Education */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-teal-100 rounded-xl">
                              <FileText className="w-5 h-5 text-teal-600" />
                            </div>
                            Required Education (
                            {position.positionRequiredEducations?.length || 0})
                          </h3>
                          <div className="space-y-3">
                            {position.positionRequiredEducations?.length > 0 ? (
                              <>
                                {position.positionRequiredEducations
                                  .slice(0, 3)
                                  .map((edu) => (
                                    <div
                                      key={edu.degreeId}
                                      className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-3 border border-teal-100"
                                    >
                                      <span className="font-semibold text-gray-900 text-sm">
                                        {edu.degree}
                                      </span>
                                    </div>
                                  ))}
                                {position.positionRequiredEducations.length >
                                  3 && (
                                  <div className="text-center py-2">
                                    <span className="text-sm text-gray-500">
                                      +
                                      {position.positionRequiredEducations
                                        .length - 3}{" "}
                                      more degrees
                                    </span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">
                                  No education requirements
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex jus gap-3"></div>
                    </div>

                    {/* Enhanced Footer */}
                    <div className="flex p-2 justify-between items-center">
                      <div className="flex text-red-600 font-bold ml-10">
                        {position.positionStatus?.status !== "OPEN" && (
                          <>
                            <Info />
                            <span className="ml-1">
                              {position.positionStatus.positionStatusReason}
                            </span>
                          </>
                        )}
                      </div>
                      <div className=" text-sm text-gray-600">
                        <button
                          onClick={() => {
                            closePositionModal();
                            navigate(
                              `/reviewer/positions/${position.positionId}`
                            );
                          }}
                          className="px-6 py-3 bg-slate-800 text-white rounded-2xl transition-all font-medium shadow-lg flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Full Details
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-600">Position Not Found !!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AllApplications;
