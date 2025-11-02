import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Briefcase,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Wallet2Icon,
  FileText,
  Target,
  Award,
  Send,
  InfoIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { currencyCalculate } from "../utility/until/AmountCalculation";

const CandidateSinglePosition = () => {
  const { id } = useParams();
  const { authToken, profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  const fetchPosition = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/positions/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const appliedResponse = await axios.get(
        `http://localhost:8080/applications/candidate/${profileData.userId}/id`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const applied = appliedResponse.data || [];
      const updatedPosition = {
        ...response.data,
        applied: applied.includes(response.data.positionId),
      };
      setPosition(updatedPosition);
    } catch (error) {
      console.error("Error fetching position:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    if (!id) return navigate("/candidate/positions");
    fetchPosition();
  }, [authToken, id]);

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

  const handleApply = async (application) => {
    setApplying(true);
    try {
      await axios.post(
        `http://localhost:8080/applications`,
        application,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      toast.success("Applyed Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchPosition();
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Header
          title="Position Details"
          showBackButton={true}
          backPath="/candidate/positions"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
        <Header
          title="Position Details"
          showBackButton={true}
          backPath="/candidate/positions"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Position Not Found
            </h3>
            <p className="text-gray-600">
              The position you're looking for doesn't exist.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header
        title="Position Details"
        showBackButton={true}
        backPath="/candidate/positions"
      />

      <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-3">
                    {position.positionTitle}
                  </h1>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(position.positionStatus?.status)}
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                        position.positionStatus?.status
                      )}`}
                    >
                      {position.positionStatus?.status || "Unknown"}
                    </span>
                  </div>
                  {position.positionStatus?.status !== "OPEN" && (
                    <div className="flex items-center gap-3 mt-4">
                      <InfoIcon className="text-red-500 w-5 h-5" />
                      <span className="text-red-500 text-sm font-bold">
                        {position.positionStatus?.positionStatusReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="rounded-xl font-bold text-xl bg-gray-50 p-2 text-gray-900"></div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  Openings
                </h3>
                <div className="text-3xl font-bold text-slate-800">
                  {position.positionTotalOpening || 0}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  Applications
                </h3>
                <div className="text-3xl font-bold text-slate-800">
                  {position.positionApplications || 0}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-slate-600" />
                  Type
                </h3>
                <div className="text-2xl font-bold text-slate-800">
                  {position.positionType || "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Wallet2Icon className="w-5 h-5 text-slate-600" />
                  Salary
                </h3>
                <div className="text-2xl font-bold text-slate-800">
                  ₹{currencyCalculate(position.positionSalary) || "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  Location
                </h3>
                <div className="text-2xl font-bold text-slate-800">
                  {position.positionLocation || "N/A"}
                </div>
              </div>
            </div>

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

            {position.positionRequiredEducations?.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-600" />
                  Required Education (
                  {position.positionRequiredEducations.length})
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex flex-wrap gap-2">
                    {position.positionRequiredEducations.map((edu) => (
                      <span
                        key={edu.degreeId}
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                      >
                        {edu.degree}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-600" />
                  Required Education (
                  {position.positionRequiredEducations.length})
                </h3>
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No education requirements specified for this position.
                  </p>
                </div>
              </div>
            )}

            {position.positionRequirements?.length > 0 ? (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-slate-600" />
                  Requirements ({position.positionRequirements.length})
                </h3>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {position.positionRequirements.map((req) => (
                      <div
                        key={req.positionRequirementId}
                        className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200"
                      >
                        <span className="font-medium text-gray-900">
                          {req.positionSkill?.skill}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            req.positionRequirement?.toLowerCase() ===
                            "mandatory"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {req.positionRequirement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-600" />
                  Required Skill ({position.positionRequirements.length})
                </h3>
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No skill requirements specified for this position.
                  </p>
                </div>
              </div>
            )}

            {position.positionStatus?.status?.toLowerCase() === "open" && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() =>
                    handleApply({
                      candidateId: profileData.userId,
                      positionId: position.positionId,
                    })
                  }
                  disabled={applying || position.applied}
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!position.applied && <Send className="w-5 h-5" />}
                  {position.applied ? "Submited" : applying ? " Submitting Application..." : "Apply for this Position"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default CandidateSinglePosition;
