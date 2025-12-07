import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { ArrowLeft, Star, Clock, CheckCircle, XCircle, Pause } from "lucide-react";
import Layout from "../../Layout";
import { currencyCalculate } from "../../until/AmountCalculation";
import { toast } from "react-toastify";
import ProfileModal from "../modal/ProfileModal";
import PositionModal from "../modal/PositionModal";
import HoldStatusModal from "../modal/HoldStatusModal";

import ShortlistTable from "./ShortlistedTable";

function AllShortlistedApplications() {
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showHoldStatus, setShowHoldStatus] = useState(false);

  const [candidateProfile, setCandidateProfile] = useState(null);
  const [candidateEducations, setCandidateEducations] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [position, setPosition] = useState(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [positionLoading, setPositionLoading] = useState(false);

  const [editHoldStatus, setEditHoldStatus] = useState(null);

  const fetchShortlistedApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/applications/shortlists",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setShortlistedApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching shortlisted applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) 
      return navigate("/login");
    fetchShortlistedApplications();
  }, [authToken, navigate]);

  const getStatusBadge = (status) => {
    const statusColors = {
      UNDERPROCESS: "bg-yellow-100 text-yellow-800",
      ACCEPTED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      PENDING: "bg-blue-100 text-blue-800",
      ONHOLD: "bg-purple-100 text-purple-800",
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

  // ───── Hold / Unhold Application ─────
  const handleHoldStatus = async (e) => {
    if (
      !e ||
      !editHoldStatus ||
      !editHoldStatus.applicationId ||
      !editHoldStatus.applicationStatusId
    )
      return;

    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8080/applications/${editHoldStatus.applicationId}/application-status/${editHoldStatus.applicationStatusId}`,
        {
          applicationStatus: editHoldStatus.applicationStatus,
          applicationFeedback: editHoldStatus.holdReason,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Application Status Changed!");
      closeHoldStatus();
      fetchShortlistedApplications();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update application status");
    }
  };

  const openHoldStatus = (applicationId) => {
    if (!applicationId) return;
    const application = shortlistedApplications.find(
      (a) => a.applicationId === applicationId
    );
    if (!application) return;

    if (application.applicationStatus.applicationStatus === "REJECTED") {
      toast.error("Application Already Rejected!");
      return closeHoldStatus();
    }

    setEditHoldStatus({
      applicationId: application.applicationId,
      applicationStatusId: application.applicationStatus.applicationStatusId,
      holdReason: application.applicationStatus.applicationFeedback,
      applicationStatus:
        application.applicationStatus.applicationStatus === "ONHOLD"
          ? "UNDERPROCESS"
          : "ONHOLD",
    });
    setShowHoldStatus(true);
  };

  const closeHoldStatus = () => {
    setShowHoldStatus(false);
    setEditHoldStatus(null);
  };

  // ───── Profile Modal ─────
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
            { headers: { Authorization: `Bearer ${authToken}` } }
          ),
          axios.get(
            `http://localhost:8080/candidate-skills/candidate/${candidateId}`,
            { headers: { Authorization: `Bearer ${authToken}` } }
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

  // ───── Position Modal ─────
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
              <p className="text-gray-600 text-lg">All Shortlists</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {shortlistedApplications.length === 0 ? (
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
          <ShortlistTable
            shortlistedApplications={shortlistedApplications}
            getStatusBadge={getStatusBadge}
            openPositionModal={openPositionModal}
            openProfileModal={openProfileModal}
            openHoldStatus={openHoldStatus}
            fetchShortlistedApplications={fetchShortlistedApplications}
          />
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

        {showHoldStatus && (
          <HoldStatusModal
            closeHoldStatus={closeHoldStatus}
            editHoldStatus={editHoldStatus}
            handleHoldStatus={handleHoldStatus}
            setEditHoldStatus={setEditHoldStatus}
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

export default AllShortlistedApplications;
