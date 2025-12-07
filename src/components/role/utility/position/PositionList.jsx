import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { currencyCalculate } from "../until/AmountCalculation";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Pause,
  Plus,
  Eye,
  Info,
  Wallet2Icon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../Layout";

const PositionList = () => {
  const { authToken, userType } = useContext(AuthContext);
  const navigate = useNavigate();
  let basePath;

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 6,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const fetchPositions = async (page = 0, size = 6) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/positions?page=${page}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setPositions(response.data.data || []);

      setPagination({
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        totalItems: response.data.totalItems,
        totalPages: response.data.totalPages,
        last: response.data.last,
      });
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBasePath = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin/")) {
      basePath = "/admin";
    } else if (currentPath.includes("/recruiter/")) {
      basePath = "/recruiter";
    } else if (currentPath.includes("/reviewer/")) {
      basePath = "/reviewer";
    } else if (currentPath.includes("/hr/")) {
      basePath = "/hr";
    } else {
      basePath = "/";
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchPositions();
    fetchBasePath();
  }, [authToken]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "on_hold":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const allowAction = ()=>{
    if(userType === "admin" || userType === "recruiter")
      return true
    return false
  }
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

  const PositionContent = () => (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="p-100 h-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <div>
          <div className="mb-10">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Position Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                      View and manage all job positions in the system
                    </p>
                  </div>
                </div>
                {allowAction() && (
                    <button
                      onClick={() => {
                        navigate(`new`);
                      }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-5 h-5" />
                      Create New Position
                    </button>
                  )}
              </div>
            </div>
          </div>

          {positions.length === 0 && userType !== "reviewer" && !loading ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Positions Found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Start by creating your first job position in the system.
              </p>
              <button
                onClick={() => {
                  navigate(`${basePath}/positions/new`);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create First Position
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {positions.map((position) => (
                  <div
                    key={position.positionId}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                            {position.positionTitle}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(position.positionStatus?.status)}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  position.positionStatus?.status
                                )}`}
                              >
                                {position.positionStatus?.status || "Unknown"}
                              </span>
                            </div>
                            {position.positionStatus.status !== "OPEN" && (
                              <div className="flex rounded-lg">
                                <Info className="w-6 text-red-500" />
                                <p className="text-red-500 text-m font-medium ml-1">
                                  {position.positionStatus.positionStatusReason}
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <MapPin className="w-4 h-4" />
                              {position.positionLocation || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <Briefcase className="w-4 h-4" />
                              {position.positionType || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <Users className="w-4 h-4" />
                              {position.positionApplications || 0} Applications
                            </div>
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <Wallet2Icon className="w-4 h-4" />₹
                              {currencyCalculate(position.positionSalary) ||
                                "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-slate-200 text-sm">
                              <Clock className="w-4 h-4" />
                              {position.positionRounds?.length || 0} Rounds
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-slate-200 text-sm">ID</div>
                          <div className="text-white font-semibold">
                            #{position.positionId}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Description
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {position.positionDescription}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Criteria
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {position.positionCriteria}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          Total Opening
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {position.positionTotalOpening}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Required Education (
                          {position.positionRequiredEducations?.length || 0})
                        </h4>
                        {position.positionRequiredEducations?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {position.positionRequiredEducations
                              .slice(0, 3)
                              .map((edu) => (
                                <span
                                  key={edu.degreeId}
                                  className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                >
                                  {edu.degree}
                                </span>
                              ))}
                            {position.positionRequiredEducations.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +
                                {position.positionRequiredEducations.length - 3}{" "}
                                more
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <span className="text-xs text-gray-400">
                              No education requirements
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Requirements (
                          {position.positionRequirements?.length || 0})
                        </h4>
                        {position.positionRequirements?.length > 0 ? (
                          <div className="space-y-2">
                            {position.positionRequirements
                              .slice(0, 3)
                              .map((req) => (
                                <div
                                  key={req.positionRequirementId}
                                  className="flex items-center justify-between bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <span className="font-medium text-gray-900 text-xs truncate flex-1 mr-2">
                                    {req.positionSkill?.skill}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
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
                            {position.positionRequirements.length > 3 && (
                              <div className="text-center py-2">
                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  +{position.positionRequirements.length - 3}{" "}
                                  more requirements
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <span className="text-xs text-gray-400">
                              No requirements specified
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            navigate(
                              `${position.positionId}`
                            );
                          }}
                          className="mx-3 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            navigate(
                              `${position.positionId}/applications`
                            );
                          }}
                          className="mx-3 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Users className="w-4 h-4" />
                          View Applications
                        </button>
                        <button
                          onClick={() => {
                            navigate(
                              `${position.positionId}/applications/shortlist`
                            );
                          }}
                          className="mx-3 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          <Users className="w-4 h-4" />
                          View Shortlist
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mt-8">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {pagination.currentPage * pagination.pageSize + 1}{" "}
                      to{" "}
                      {Math.min(
                        (pagination.currentPage + 1) * pagination.pageSize,
                        pagination.totalItems
                      )}{" "}
                      of {pagination.totalItems} positions
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          fetchPositions(
                            pagination.currentPage - 1,
                            pagination.pageSize
                          )
                        }
                        disabled={pagination.currentPage === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const pageNum =
                              pagination.currentPage < 3
                                ? i
                                : pagination.currentPage - 2 + i;
                            if (pageNum >= pagination.totalPages) return null;
                            return (
                              <button
                                key={pageNum}
                                onClick={() =>
                                  fetchPositions(pageNum, pagination.pageSize)
                                }
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  pageNum === pagination.currentPage
                                    ? "bg-slate-800 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {pageNum + 1}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          fetchPositions(
                            pagination.currentPage + 1,
                            pagination.pageSize
                          )
                        }
                        disabled={pagination.last}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <PositionContent />
    </Layout>
  );
};

export default PositionList;
