import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  Briefcase,
  Ban,
  MapPin,
  CheckCircle,
  XCircle,
  Pause,
  Clock,
  Eye,
  Wallet2Icon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  InfoIcon,
  Users,
  SquareArrowOutUpRight,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import { currencyCalculate } from "../utility/until/AmountCalculation";
import Layout from "../utility/Layout";

const CandidatePositions = () => {
  const { authToken, profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [allPositions, setAllPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 6,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    status: "OPEN",
  });

  const fetchPositions = async (page = 0, size = 6) => {
    if (!authToken) return navigate("/login");
    try {
      const positionResponse = await axios.get(
        `http://localhost:8080/positions?page=${page}&size=${size}`,
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
      const positions = positionResponse.data.data || [];
      const applied = appliedResponse.data || [];
      const updatedPositions = positions.map((position) => ({
        ...position,
        applied: applied.includes(position.positionId),
      }));
      setAllPositions(updatedPositions);
      setPagination({
        currentPage: positionResponse.data.currentPage,
        pageSize: positionResponse.data.pageSize,
        totalItems: positionResponse.data.totalItems,
        totalPages: positionResponse.data.totalPages,
        last: positionResponse.data.last,
      });
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchPositions();
  }, [authToken]);

  useEffect(() => {
    let filtered = [...allPositions];

    if (filters.search) {
      filtered = filtered.filter(
        (pos) =>
          pos.positionTitle
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          pos.positionDescription
            ?.toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter((pos) =>
        pos.positionLocation
          ?.toLowerCase()
          .includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((pos) => pos.positionType === filters.type);
    }

    if (filters.status) {
      filtered = filtered.filter(
        (pos) => pos.positionStatus?.status === filters.status
      );
    }

    setPositions(filtered);
  }, [allPositions, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", location: "", type: "", status: "OPEN" });
  };

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
      const response = await axios.post(
        `http://localhost:8080/applications`,
        application,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchPositions();
      toast.success("Applyed Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error applying:", error);
      alert("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-3">
                    Job Opportunities
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-500" />
                    Discover your next career opportunity
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      placeholder="Search positions..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) =>
                        handleFilterChange("location", e.target.value)
                      }
                      placeholder="Filter by location"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange("type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                    >
                      <option value="">All Types</option>
                      <option value="FULLTIME">Full Time</option>
                      <option value="PARTTIME">Part Time</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-slate-500"
                    >
                      <option value="">All Status</option>
                      <option value="OPEN">Open</option>
                      <option value="CLOSED">Closed</option>
                      <option value="ONHOLD">On Hold</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {positions.length} position
                    {positions.length !== 1 ? "s" : ""} found
                  </div>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 rounded font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              {/* )} */}
            </div>

            {positions.length === 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-16 text-center">
                <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No Positions Available
                </h3>
                <p className="text-gray-600">
                  Check back later for new opportunities.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {positions.map((position) => (
                    <div
                      key={position.positionId}
                      className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden"
                    >
                      <div className="bg-slate-800 p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-3">
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
                                <div className="flex items-center gap-2 text-red-600 text-sm">
                                  <InfoIcon className="w-4 h-4" />
                                  {
                                    position.positionStatus
                                      ?.positionStatusReason
                                  }
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
                                <Wallet2Icon className="w-4 h-4" />₹
                                {currencyCalculate(position.positionSalary) ||
                                  "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-slate-200 text-sm">
                                 <Users className="w-4 h-4" />
                                {position.positionApplications || 0}{" "}Applications
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-slate-200 text-sm">
                              Openings
                            </div>
                            <div className="text-white font-bold text-xl">
                              {position.positionTotalOpening}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Description
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                            {position.positionDescription}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Requirements
                          </h4>
                          {position.positionRequirements?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {position.positionRequirements
                                .slice(0, 3)
                                .map((req) => (
                                  <span
                                    key={req.positionRequirementId}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                                  >
                                    {req.positionSkill?.skill}
                                  </span>
                                ))}
                              {position.positionRequirements.length > 3 && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                                  +{position.positionRequirements.length - 3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm italic">
                              No specific requirements
                            </p>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Education
                          </h4>
                          {position.positionRequiredEducations?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {position.positionRequiredEducations
                                .slice(0, 3)
                                .map((req) => (
                                  <span
                                    key={req.degreeId}
                                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium"
                                  >
                                    {req.degree}
                                  </span>
                                ))}
                              {position.positionRequiredEducations.length >
                                3 && (
                                <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-xs">
                                  +
                                  {position.positionRequiredEducations.length -
                                    3}{" "}
                                  more
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm italic">
                              No specific requirements
                            </p>
                          )}
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/candidate/positions/${position.positionId}`
                                )
                              }
                              className=" inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded hover:bg-slate-700 font-medium"
                            >
                              View Details
                              <Eye />
                            </button>
                            <button
                              disabled={
                                position.positionStatus?.status !== "OPEN" ||
                                position.applied
                              }
                              onClick={() =>
                                handleApply({
                                  candidateId: profileData.userId,
                                  positionId: position.positionId,
                                })
                              }
                              className={`inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded ${
                                position.positionStatus?.status !== "OPEN" ||
                                position.applied ||
                                applying
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-slate-700"
                              }  font-medium`}
                            >
                              {position.positionStatus?.status !== "OPEN"
                                ? "Closed"
                                : position.applied
                                ? "Submited"
                                : "Apply"}
                              {position.positionStatus?.status !== "OPEN" ? (
                                <Ban />
                              ) : (
                                !position.applied && <SquareArrowOutUpRight />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing{" "}
                        {pagination.currentPage * pagination.pageSize + 1} to{" "}
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
                          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500"
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
                                  className={`px-3 py-2 rounded text-sm font-medium ${
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
                          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500"
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default CandidatePositions;
