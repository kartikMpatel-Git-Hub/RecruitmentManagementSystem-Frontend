import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  FileText,
  Target,
  Users,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  Info,
  Eye,
  Star,
  MapPin,
} from "lucide-react";
import Layout from "../Layout";
import { currencyCalculate } from "../until/AmountCalculation";

const SinglePosition = () => {
  const { id } = useParams();
  const { authToken, userType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [skills, setSkills] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReq, setEditingReq] = useState(null);
  const [editingPosition, setEditingPosition] = useState(false);
  const [newReq, setNewReq] = useState({
    skillId: "",
    requirement: "MANDATORY",
  });
  const [degrees, setDegrees] = useState([]);
  const [editingEducation, setEditingEducation] = useState(false);
  const [selectedEducations, setSelectedEducations] = useState([]);

  const fetchPosition = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/positions/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setPosition(response.data);
    } catch (error) {
      console.error("Error fetching position:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8080/skills", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degrees", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDegrees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    if (!id) return navigate("../");
    fetchPosition();
    fetchSkills();
    fetchDegrees();
  }, [authToken, id]);

  useEffect(() => {
    if (position?.positionRequiredEducations) {
      setSelectedEducations(
        position.positionRequiredEducations.map((edu) => edu.degreeId)
      );
    }
  }, [position]);

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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this position?"))
      return;
    setDeleting(true);
    try {
      await axios.delete(`http://localhost:8080/positions/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error deleting position:", error);
      alert("Failed to delete position");
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdatePosition = async () => {
    try {
      await axios.put(
        `http://localhost:8080/positions/${id}`,
        {
          positionTitle: position.positionTitle,
          positionDescription: position.positionDescription,
          positionCriteria: position.positionCriteria,
          positionTotalOpening: position.positionTotalOpening,
          positionType: position.positionType,
          positionSalary: parseFloat(position.positionSalary) || 0,
          positionLocation: position.positionLocation,
          positionStatus: {
            status: position.positionStatus.status,
            positionStatusReason: position.positionStatus.positionStatusReason,
          },
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setEditingPosition(false);
    } catch (error) {
      console.error("Error updating position:", error);
      alert("Failed to update position");
    }
  };

  const handleAddRequirement = async () => {
    try {
      await axios.post(
        `http://localhost:8080/positions/${id}/requirements`,
        {
          positionSkill: { skillId: parseInt(newReq.skillId) },
          positionRequirement: newReq.requirement,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setNewReq({ skillId: "", requirement: "MANDATORY" });
      setShowAddForm(false);
      fetchPosition();
    } catch (error) {
      console.error("Error adding requirement:", error);
      alert("Failed to add requirement");
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    if (!window.confirm("Delete this requirement?")) return;
    try {
      await axios.delete(
        `http://localhost:8080/positions/${id}/requirements/${reqId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchPosition();
    } catch (error) {
      console.error("Error deleting requirement:", error);
      alert("Failed to delete requirement");
    }
  };

  const handleUpdateRequirement = async (reqId) => {
    try {
      await axios.put(
        `http://localhost:8080/positions/${id}/requirements/${reqId}`,
        {
          positionSkill: { skillId: editingReq.positionSkill.skillId },
          positionRequirement: editingReq.positionRequirement,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setEditingReq(null);
      fetchPosition();
    } catch (error) {
      console.error("Error updating requirement:", error);
      alert("Failed to update requirement");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-800"></div>
        </div>
      </Layout>
    );
  }

  if (!position) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center max-w-md">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Position Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              The position you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Positions
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Position Header Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl">
                    <Briefcase className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                      {position.positionTitle}
                    </h1>
                    <div className="flex items-center gap-4 mb-3">
                      {getStatusIcon(position.positionStatus?.status)}
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                          position.positionStatus?.status
                        )}`}
                      >
                        {position.positionStatus?.status || "Unknown"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-300">
                        ID: #{position.positionId}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      Created by{" "}
                      <span className="font-semibold text-white">
                        {position.createdByName}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`applications`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all font-medium shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    Applications
                  </button>
                  <button
                    onClick={() => navigate(`applications/shortlist`)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all font-medium shadow-lg"
                  >
                    <Star className="w-4 h-4" />
                    Shortlisted
                  </button>
                  {userType === "admin" ||
                    (userType === "recruiter" && (
                      <>
                        <button
                          onClick={() => setEditingPosition(!editingPosition)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all font-medium shadow-lg"
                        >
                          <Edit className="w-4 h-4" />
                          {editingPosition ? "Cancel" : "Edit"}
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={deleting}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500 text-white rounded-xl transition-all font-medium shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-8 bg-gray-50 border-b">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">
                    {position.positionTotalOpening || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Total Openings
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">
                    {position.positionApplications || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">
                    ₹{currencyCalculate(position.positionSalary) || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Annual Salary
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">
                    {position.positionType || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Position Type
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">
                    {position.positionLanguage || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Position Language
                  </div>
                </div>
              </div>
            </div>

            {/* Position Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FileText className="w-5 h-5 text-slate-600" />
                      Description
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {position.positionDescription}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <Target className="w-5 h-5 text-slate-600" />
                      Criteria
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {position.positionCriteria}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-600" />
                      Location
                    </h3>
                    <p className="text-gray-700">
                      {position.positionLocation || "Not specified"}
                    </p>
                  </div>

                  {position.positionStatus.status !== "OPEN" && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-3">
                        <Info className="w-5 h-5 text-red-600" />
                        Status Reason
                      </h3>
                      <p className="text-red-700">
                        {position.positionStatus.positionStatusReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {editingPosition && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Position
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Title
                    </label>
                    <input
                      type="text"
                      value={position.positionTitle}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionTitle: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      value={position.positionLocation || ""}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionLocation: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={position.positionDescription}
                    onChange={(e) =>
                      setPosition({
                        ...position,
                        positionDescription: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Criteria
                  </label>
                  <textarea
                    value={position.positionCriteria}
                    onChange={(e) =>
                      setPosition({
                        ...position,
                        positionCriteria: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Total Openings
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={position.positionTotalOpening}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionTotalOpening: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Type
                    </label>
                    <select
                      value={position.positionType || ""}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="FULL_TIME">FULL_TIME</option>
                      <option value="PART_TIME">PART_TIME</option>
                      <option value="CONTRACT">CONTRACT</option>
                      <option value="INTERNSHIP">INTERNSHIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Salary
                    </label>
                    <input
                      type="number"
                      value={position.positionSalary || ""}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionSalary: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Status
                    </label>
                    <select
                      value={position.positionStatus.status}
                      onChange={(e) =>
                        setPosition({
                          ...position,
                          positionStatus: {
                            ...position.positionStatus,
                            status: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="ON_HOLD">ON_HOLD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Status Reason
                  </label>
                  <input
                    type="text"
                    value={position.positionStatus.positionStatusReason || ""}
                    onChange={(e) =>
                      setPosition({
                        ...position,
                        positionStatus: {
                          ...position.positionStatus,
                          positionStatusReason: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdatePosition}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingPosition(false);
                      fetchPosition();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Requirements and Education Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Requirements */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-600" />
                  Requirements ({position.positionRequirements?.length || 0})
                </h3>
                {userType === "admin" ||
                  (userType === "recruiter" && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  ))}
              </div>

              {showAddForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="space-y-4">
                    <select
                      value={newReq.skillId}
                      onChange={(e) =>
                        setNewReq({ ...newReq, skillId: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select Skill</option>
                      {skills.map((skill) => (
                        <option key={skill.skillId} value={skill.skillId}>
                          {skill.skill}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newReq.requirement}
                      onChange={(e) =>
                        setNewReq({ ...newReq, requirement: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                    >
                      <option value="MANDATORY">MANDATORY</option>
                      <option value="PREFERRED">PREFERRED</option>
                      <option value="OPTIONAL">OPTIONAL</option>
                    </select>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddRequirement}
                        disabled={!newReq.skillId}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 transition-all font-semibold shadow-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setNewReq({ skillId: "", requirement: "MANDATORY" });
                        }}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {position.positionRequirements?.length > 0 ? (
                  position.positionRequirements.map((req) => (
                    <div
                      key={req.positionRequirementId}
                      className="bg-gray-50 rounded-2xl p-6"
                    >
                      {editingReq?.positionRequirementId ===
                      req.positionRequirementId ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                              value={editingReq.positionSkill.skillId}
                              onChange={(e) =>
                                setEditingReq({
                                  ...editingReq,
                                  positionSkill: {
                                    ...editingReq.positionSkill,
                                    skillId: parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                            >
                              {skills.map((skill) => (
                                <option
                                  key={skill.skillId}
                                  value={skill.skillId}
                                >
                                  {skill.skill}
                                </option>
                              ))}
                            </select>
                            <select
                              value={editingReq.positionRequirement}
                              onChange={(e) =>
                                setEditingReq({
                                  ...editingReq,
                                  positionRequirement: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-400 bg-gray-50 focus:bg-white"
                            >
                              <option value="MANDATORY">MANDATORY</option>
                              <option value="PREFERRED">PREFERRED</option>
                              <option value="OPTIONAL">OPTIONAL</option>
                            </select>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                handleUpdateRequirement(
                                  req.positionRequirementId
                                )
                              }
                              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                            >
                              <Save className="w-4 h-4 inline mr-2" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReq(null)}
                              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                            >
                              <X className="w-4 h-4 inline mr-2" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {req.positionSkill?.skill}
                            </h4>
                            <span
                              className={`p-2 ml-3 rounded-full text-sm font-medium  ${
                                req.positionRequirement?.toLowerCase() ===
                                "mandatory"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {req.positionRequirement}
                            </span>
                          </div>
                          {userType === "admin" ||
                            (userType === "recruiter" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setEditingReq(req)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteRequirement(
                                      req.positionRequirementId
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No requirements specified</p>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-slate-600" />
                  Education ({position.positionRequiredEducations?.length || 0})
                </h3>
                {userType === "admin" ||
                  (userType === "recruiter" && (
                    <button
                      onClick={() => setEditingEducation(!editingEducation)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all font-medium shadow-lg"
                    >
                      <Edit className="w-4 h-4" />
                      {editingEducation ? "Cancel" : "Edit"}
                    </button>
                  ))}
              </div>

              {editingEducation && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {degrees.map((degree) => (
                      <label
                        key={degree.degreeId}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEducations.includes(degree.degreeId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEducations([
                                ...selectedEducations,
                                degree.degreeId,
                              ]);
                            } else {
                              setSelectedEducations(
                                selectedEducations.filter(
                                  (id) => id !== degree.degreeId
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {degree.degree}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const selectedDegrees = degrees.filter((d) =>
                            selectedEducations.includes(d.degreeId)
                          );
                          await axios.patch(
                            `http://localhost:8080/positions/${id}/educations`,
                            selectedDegrees,
                            {
                              headers: { Authorization: `Bearer ${authToken}` },
                            }
                          );
                          setEditingEducation(false);
                          fetchPosition();
                        } catch (error) {
                          console.error("Error updating education:", error);
                          alert("Failed to update education requirements");
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg"
                    >
                      Save Education
                    </button>
                    <button
                      onClick={() => {
                        setEditingEducation(false);
                        setSelectedEducations(
                          position.positionRequiredEducations?.map(
                            (edu) => edu.degreeId
                          ) || []
                        );
                      }}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {position.positionRequiredEducations?.length > 0 ? (
                  position.positionRequiredEducations.map((edu) => (
                    <div
                      key={edu.degreeId}
                      className="bg-orange-50 rounded-2xl p-4"
                    >
                      <span className="font-medium text-orange-800">
                        {edu.degree}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No education requirements</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePosition;
