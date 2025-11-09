import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
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
      application = {
        ...application,
        candidateId : profileData.userId
      }
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

      <div className="flex-1 max-w-7xl mx-auto px-6 py-8">
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
                    {/* <span className="text-slate-300">•</span>
                    <span className="text-slate-300">
                      ID: #{position.positionId}
                    </span> */}
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
                {!position.applied && position.positionStatus?.status === "OPEN" && (
                  <button
                    onClick={() => handleApply({ positionId: position.positionId })}
                    disabled={applying}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all font-medium shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )}
                {position.applied && (
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                    Applied
                  </div>
                )}
              </div>
            </div>
          </div>

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
                  {position.positionLocation || "N/A"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Location
                </div>
              </div>
            </div>
          </div>

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
                {position.positionStatus.status !== "OPEN" && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-3">
                      <InfoIcon className="w-5 h-5 text-red-600" />
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

        {position.positionRounds && position.positionRounds.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-slate-600" />
              Selection Rounds ({position.positionRounds.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {position.positionRounds
                .sort((a, b) => a.roundSequence - b.roundSequence)
                .map((round) => (
                  <div
                    key={round.positionRoundId}
                    className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {round.roundSequence}
                      </div>
                      <span className="text-sm text-slate-600 font-medium">Round {round.roundSequence}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">
                      {round.positionRoundType.replace('_', ' ')}
                    </h4>
                    <div className="text-sm text-slate-600">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        round.positionRoundType === 'TECHNICAL' ? 'bg-blue-100 text-blue-800' :
                        round.positionRoundType === 'HR' ? 'bg-green-100 text-green-800' :
                        round.positionRoundType === 'CODING' ? 'bg-purple-100 text-purple-800' :
                        round.positionRoundType === 'APTITUDE' ? 'bg-orange-100 text-orange-800' :
                        round.positionRoundType === 'GROUP_DISCUSSION' ? 'bg-yellow-100 text-yellow-800' :
                        round.positionRoundType === 'CEO' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {round.positionRoundType}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-slate-600" />
              Requirements ({position.positionRequirements?.length || 0})
            </h3>
            <div className="space-y-4">
              {position.positionRequirements?.length > 0 ? (
                position.positionRequirements.map((req) => (
                  <div
                    key={req.positionRequirementId}
                    className="bg-gray-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {req.positionSkill?.skill}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          req.positionRequirement?.toLowerCase() === "mandatory"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {req.positionRequirement}
                      </span>
                    </div>
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

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-slate-600" />
              Education ({position.positionRequiredEducations?.length || 0})
            </h3>
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
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No education requirements</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default CandidateSinglePosition;
