import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import {
  User,
  Eye,
  ArrowLeft,
  Users,
  Edit,
  Star,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
} from "lucide-react";
import Layout from "../Layout";
import { toast } from "react-toastify";
import { currencyCalculate } from "../until/AmountCalculation";
import PositionModal from "./modal/PositionModal";
import ProfileModal from "./modal/ProfileModal";
import StatusModal from "./modal/StatusModal";
import Applications from "./modal/Applications";

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
  const [statusForm, setStatusForm] = useState({
    positionId: "",
    currentStatus: "",
    applicationStatus: "",
    applicationFeedback: "",
  });

  const fetchApplications = async () => {
    // setLoading(true)
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

  const openStatusModal = (application) => {
    setSelectedApplication(application);
    setStatusForm({
      positionId: application.positionId,
      currentStatus: application.applicationStatus?.applicationStatus || "",
      applicationStatus: application.applicationStatus?.applicationStatus || "",
      applicationFeedback:
        application.applicationStatus?.applicationFeedback || "",
    });
    setShowStatusModal(true);
  }

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedApplication(null);
    setStatusForm({
      positionId: "",
      currentStatus: "",
      applicationStatus: "",
      applicationFeedback: "",
    });
  }

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setStatusForm((prev) => ({ ...prev, [name]: value }));
  }

  const handleStatusUpdate = async (e, positionId) => {
    if (!positionId) return;
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/applications/${positionId}/application-status/${selectedApplication.applicationStatus.applicationStatusId}`,
        {
          applicationStatus: statusForm.applicationStatus,
          applicationFeedback: statusForm.applicationFeedback,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Application status updated successfully!");
      fetchApplications();
      closeStatusModal();
    } catch (error) {
      toast.error("Failed to update application status");
    }
  };

  const handleShortlistApplication = async (applicationId) => {
    if (!applicationId) return;
    try {
      await axios.patch(
        `http://localhost:8080/applications/${applicationId}/shortlist`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Application Shortlisted Successfully!");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to shortlist application");
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
            <Applications 
                applications={applications}
                getStatusBadge={getStatusBadge}
                openPositionModal={openPositionModal}
                openProfileModal={openProfileModal}
                openStatusModal={openStatusModal}
                handleShortlistApplication={handleShortlistApplication}
            />
          </>
        )}

        {showStatusModal && (
          <StatusModal
            closeStatusModal={closeStatusModal}
            statusForm={statusForm}
            handleStatusChange={handleStatusChange}
            handleStatusUpdate={handleStatusUpdate}
            selectedApplication={selectedApplication}
          />
        )}

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
      </div>
    </Layout>
  );
}

export default AllApplications;
