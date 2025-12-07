import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Upload, Trash2, Plus, CheckCircle, XCircle, Clock, Download } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../Layout";

const BulkEntryList = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/bulk-entries/all", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setJobs(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!authToken || !jobId) return navigate("/login");
    try {
      await axios.delete(`http://localhost:8080/bulk-entries/${jobId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchJobs();
      toast.success("Job Deleted Successfully!");
    } catch (error) {
      toast.error("Error Deleting Job!");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
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
                  onClick={() => navigate("/admin/bulk-entry/new")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  New Upload
                </button>
              </div>
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
                onClick={() => navigate("/admin/bulk-entry/new")}
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
                        <span className="text-white font-medium">{job.status}</span>
                      </div>
                      <Trash2
                        className="text-white cursor-pointer hover:text-red-300"
                        onClick={() => deleteJob(job.jobId)}
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
                        <div className="text-lg font-bold text-blue-600">{job.totalRows}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{job.successRows}</div>
                        <div className="text-xs text-gray-600">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">{job.failedRows}</div>
                        <div className="text-xs text-gray-600">Failed</div>
                      </div>
                    </div>
                    
                    {job.status === 'COMPLETED' && (
                      <div className="space-y-2">
                        {job.successFilePath && (
                          <button
                            onClick={() => downloadFile(job.successFilePath, 'success.xlsx')}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Success File
                          </button>
                        )}
                        {job.errorFilePath && (
                          <button
                            onClick={() => downloadFile(job.errorFilePath, 'errors.xlsx')}
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
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <JobContent />
    </Layout>
  );
};

export default BulkEntryList;
