import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  Upload,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  FileText,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../Layout";

const BulkEntryList = () => {
  const { authToken, profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const fetchJobs = async (page = 0) => {
    try {
      const response = await axios.get("http://localhost:8080/bulk-entries/", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, size: pagination.pageSize },
      });
      const { data, currentPage, pageSize, totalItems, totalPages, last } = response.data;
      setJobs(data || response.data);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchJobs(newPage);
    }
  };

  const getJobData = async (jobId) => {
    if (!authToken || !jobId) return navigate("/login");
    try {
      const response = await axios.get(`http://localhost:8080/bulk-entries/status/${jobId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("Job Detail Get Successfully!");
    } catch (error) {
      toast.error("Error While getting Job!");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "IN_PROGRESS":
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid Excel file (.xlsx)");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const res = await axios.post(`http://localhost:8080/bulk-entries/excel/upload/${profileData.userId}`,
      {
        file: file,
      },  
      {
        headers: { 
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("File uploaded successfully!");
      setShowUploadModal(false);
      setFile(null);
      fetchJobs();
    } catch (err) {
      setError("Upload failed. Please try again.");
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchJobs();
  }, [authToken]);

  const JobContent = () => (
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
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Bulk Upload Jobs
                    </h1>
                    <p className="text-gray-600 text-lg">
                      View and manage all bulk upload jobs in the system
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  New Upload
                </button>
              </div>
            </div>

            {/* Excel Format Guide Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setShowFormatGuide(!showFormatGuide)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-200 rounded-xl">
                    <Info className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-base font-semibold text-amber-900">
                      Excel File Format Guide
                    </span>
                    <p className="text-sm text-amber-700">Click to view required column structure and sample data</p>
                  </div>
                </div>
                {showFormatGuide ? (
                  <ChevronUp className="w-5 h-5 text-amber-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-amber-700" />
                )}
              </button>
              
              {showFormatGuide && (
                <div className="px-6 pb-6 border-t border-amber-200">
                  <p className="text-sm text-amber-800 mt-4 mb-4">
                    Your Excel file (.xlsx) must contain the following columns in the exact order. Below is the required structure with sample data:
                  </p>
                  
                  {/* Column Structure Table */}
                  <div className="bg-white rounded-xl border border-amber-200 overflow-hidden mb-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-800 text-white">
                          <tr>
                            <th className="px-3 py-2.5 text-left font-medium">#</th>
                            <th className="px-3 py-2.5 text-left font-medium">Column Name</th>
                            <th className="px-3 py-2.5 text-left font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">1</td><td className="px-3 py-2 font-medium text-gray-700">userName</td><td className="px-3 py-2 text-gray-600">Unique username for login</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">2</td><td className="px-3 py-2 font-medium text-gray-700">userEmail</td><td className="px-3 py-2 text-gray-600">Valid email address</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">3</td><td className="px-3 py-2 font-medium text-gray-700">candidateFirstName</td><td className="px-3 py-2 text-gray-600">First name</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">4</td><td className="px-3 py-2 font-medium text-gray-700">candidateMiddleName</td><td className="px-3 py-2 text-gray-600">Middle name (optional)</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">5</td><td className="px-3 py-2 font-medium text-gray-700">candidateLastName</td><td className="px-3 py-2 text-gray-600">Last name</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">6</td><td className="px-3 py-2 font-medium text-gray-700">candidatePhoneNumber</td><td className="px-3 py-2 text-gray-600">10-digit phone number</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">7</td><td className="px-3 py-2 font-medium text-gray-700">candidateGender</td><td className="px-3 py-2 text-gray-600">Male or Female</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">8</td><td className="px-3 py-2 font-medium text-gray-700">candidateDateOfBirth</td><td className="px-3 py-2 text-gray-600">Date in YYYY-MM-DD format</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">9</td><td className="px-3 py-2 font-medium text-gray-700">candidateAddress</td><td className="px-3 py-2 text-gray-600">Street address</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">10</td><td className="px-3 py-2 font-medium text-gray-700">candidateCity</td><td className="px-3 py-2 text-gray-600">City name</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">11</td><td className="px-3 py-2 font-medium text-gray-700">candidateState</td><td className="px-3 py-2 text-gray-600">State name</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">12</td><td className="px-3 py-2 font-medium text-gray-700">candidateCountry</td><td className="px-3 py-2 text-gray-600">Country name</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">13</td><td className="px-3 py-2 font-medium text-gray-700">candidateZipCode</td><td className="px-3 py-2 text-gray-600">Postal/ZIP code</td></tr>
                          <tr className="hover:bg-amber-50"><td className="px-3 py-2 text-gray-500">14</td><td className="px-3 py-2 font-medium text-gray-700">candidateTotalExperienceInYears</td><td className="px-3 py-2 text-gray-600">Years of experience (number)</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sample Data Table */}
                  <h4 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Sample Data (Copy this format in your Excel):
                  </h4>
                  <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-800 text-white">
                          <tr>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">userName</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">userEmail</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateFirstName</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateMiddleName</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateLastName</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidatePhoneNumber</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateGender</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateDateOfBirth</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateAddress</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateCity</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateState</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateCountry</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateZipCode</th>
                            <th className="px-2 py-2 text-left font-medium whitespace-nowrap">candidateTotalExperienceInYears</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100">
                          <tr className="hover:bg-amber-50">
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">kartik01</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">patelkartik7892@gmail.com</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">kartik</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">miteshbhai</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">patel</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">8460888834</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">Male</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">2004-05-22</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">123 Street</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">Bhavnagar</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">Gujarat</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">India</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">364004</td>
                            <td className="px-2 py-1.5 text-gray-700 whitespace-nowrap">2</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 p-3 bg-amber-100 rounded-lg">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-700" />
                    <div className="text-sm text-amber-800">
                      <strong>Important Notes:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Date format must be <strong>YYYY-MM-DD</strong> (e.g., 1998-01-21)</li>
                        <li>Gender must be exactly <strong>Male</strong> or <strong>Female</strong></li>
                        <li>Phone number should be 10 digits without country code</li>
                        <li>All column headers must match exactly as shown above</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Upload Jobs Found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Start by uploading your first bulk data file.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Start Upload
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="text-white font-medium">
                          {job.status}
                        </span>
                      </div>
                      <Eye
                        className="text-white cursor-pointer hover:text-red-300"
                        onClick={() => navigate(`./${job.jobId}`)}
                      />
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        Job #{job.jobId}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {job.totalRows}
                        </div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {job.successRows}
                        </div>
                        <div className="text-xs text-gray-600">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {job.failedRows}
                        </div>
                        <div className="text-xs text-gray-600">Failed</div>
                      </div>
                    </div>

                    {job.status === "COMPLETED" && (
                      <div className="space-y-2">
                        {job.successFilePath && (
                          <button
                            onClick={() =>
                              downloadFile(job.successFilePath, "success.xlsx")
                            }
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Success File
                          </button>
                        )}
                        {job.errorFilePath && (
                          <button
                            onClick={() =>
                              downloadFile(job.errorFilePath, "errors.xlsx")
                            }
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Error File
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages >= 1 && (
            <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.currentPage + 1) * pagination.pageSize,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} jobs
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.last}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <JobContent />

      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 -m-8 mb-6 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    Upload Excel File
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center mb-6 bg-slate-50">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-slate-600" />
                </div>
                <div className="mb-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-3 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg">
                      <FileText className="w-4 h-4" />
                      Choose Excel File
                    </span>
                  </label>
                </div>
                {file && (
                  <div className="flex items-center justify-center text-sm text-slate-700 bg-white px-4 py-2 rounded-lg border">
                    <FileText className="w-4 h-4 mr-2 text-slate-600" />
                    {file.name}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg"
                >
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BulkEntryList;
