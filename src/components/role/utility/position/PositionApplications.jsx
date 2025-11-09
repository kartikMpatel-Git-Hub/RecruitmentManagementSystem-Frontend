import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import {
  User,
  Users,
  ArrowLeft,
  Star,
} from "lucide-react";
import Layout from "../Layout";
import { toast } from "react-toastify";
import ProfileModal from "./modal/ProfileModal";
import StatusModal from "./modal/StatusModal";
import Applications from "./modal/Applications";

function PositionApplications() {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [candidateEducations, setCandidateEducations] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [statusForm, setStatusForm] = useState({
    currentStatus: "",
    applicationStatus: "",
    applicationFeedback: "",
  });

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/applications/position/${positionId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setApplications(response.data.data || []);
      
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlistApplication =async (applicationId) => {
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
      console.log(error);
      toast.error("Failed to shortlist application");
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchApplications();
  }, [positionId, authToken]);

  const getStatusBadge = (status) => {
    const statusColors = {
      UNDERPROCESS: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-blue-100 text-blue-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const openStatusModal = useCallback((application) => {
    setSelectedApplication(application);
    setStatusForm({
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

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/applications/${selectedApplication.positionId}/application-status/${selectedApplication.applicationStatus.applicationStatusId}`,
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
                Position Applications
              </h1>
              <p className="text-gray-600 text-lg">
                Applications for Position ID: {positionId}
              </p>
            </div>

            <button
              onClick={() => navigate("./shortlist")}
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
                statusFilter={statusFilter}
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

      </div>
    </Layout>
  );
}

export default PositionApplications;
