import React from "react";
import {
  Eye,
  Briefcase,
  Target,
  Users,
  X,
  Info,
  FileText,
  MapPin,
  Languages,
  Wallet,
} from "lucide-react";
import { currencyCalculate } from "../../until/AmountCalculation";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PositionModal({
  position,
  positionLoading,
  closePositionModal,
  getStatusIcon,
}) {
  const navigate = useNavigate();
  const [basePath, setBasePath] = useState("");
  const fetchBasePath = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin/")) {
      setBasePath("/admin");
    } else if (currentPath.includes("/recruiter/")) {
      setBasePath("/recruiter");
    } else if (currentPath.includes("/reviewer/")) {
      setBasePath("/reviewer");
    } else {
      setBasePath("/");
    }
  };
  useEffect(() => {
    fetchBasePath();
  }, []);
  return (
    <>
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
                            <span>{position.positionLocation || "Remote"}</span>
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
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ₹{currencyCalculate(position.positionSalary) || "N/A"}
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
                            {position.positionDescription.length > 100 ? position.positionDescription.substring(0,100)+" ..." : position.positionDescription}
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
                            {position.positionCriteria.length > 100 ? position.positionCriteria.substring(0,100)+" ..." : position.positionCriteria}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                              .slice(0, 2)
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
                                  +{position.positionRequirements.length - 3}{" "}
                                  more skills
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No skills specified</p>
                          </div>
                        )}
                      </div>
                    </div>

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
                              .slice(0, 2)
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
                            {position.positionRequiredEducations.length > 3 && (
                              <div className="text-center py-2">
                                <span className="text-sm text-gray-500">
                                  +
                                  {position.positionRequiredEducations.length -
                                    3}{" "}
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
                        navigate(`${basePath}/positions/${position.positionId}`);
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
    </>
  );
}

export default PositionModal;
