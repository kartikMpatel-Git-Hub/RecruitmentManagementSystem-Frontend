import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { CheckCircle, XCircle, Clock, AlertCircle, ArrowLeft, Download, Filter, Search, RefreshCw } from 'lucide-react';
import axios from 'axios';
import Layout from '../Layout';

const BulkStatus = () => {
  const { id } = useParams();
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobStatus = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await axios.get(`http://localhost:8080/bulk-entries/status/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setJobData(response.data);
    } catch (error) {
      console.error('Error fetching job status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const getFilteredRows = () => {
    if (!jobData?.rowDetails) return [];
    let filtered = jobData.rowDetails;
    
    if (filter !== 'ALL') {
      filtered = filtered.filter(row => row.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.rowNumber.toString().includes(searchTerm) ||
        (row.message && row.message.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const getProgressPercentage = () => {
    if (!jobData) return 0;
    return Math.round((jobData.successRows / jobData.totalRows) * 100);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRowStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'ADDED': return `${baseClasses} bg-green-100 text-green-800`;
      case 'FAILED': return `${baseClasses} bg-red-100 text-red-800`;
      default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  useEffect(() => {
    if (!authToken) return navigate('/login');
    fetchJobStatus();
  }, [id, authToken]);

  const StatusContent = () => (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : jobData ? (
        <div>
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                  </button>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(jobData.status)}
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Job #{jobData.jobId}</h1>
                      <p className="text-slate-600">Status: {jobData.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600">{jobData.totalRows}</div>
                  <div className="text-blue-700 font-medium">Total Rows</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600">{jobData.successRows}</div>
                  <div className="text-green-700 font-medium">Success Rows</div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-red-600">{jobData.failedRows}</div>
                  <div className="text-red-700 font-medium">Failed Rows</div>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-slate-600">{getProgressPercentage()}%</div>
                  <div className="text-slate-700 font-medium">Success Rate</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Processing Progress</span>
                  <span className="text-sm text-gray-500">{jobData.successRows + jobData.failedRows} / {jobData.totalRows}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${((jobData.successRows + jobData.failedRows) / jobData.totalRows) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Download Section */}
              {jobData.status === 'COMPLETED' && (
                <div className="flex gap-4 mb-6">
                  {jobData.successFilePath && (
                    <button
                      onClick={() => downloadFile(jobData.successFilePath, 'success_records.xlsx')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Success File
                    </button>
                  )}
                  {jobData.errorFilePath && (
                    <button
                      onClick={() => downloadFile(jobData.errorFilePath, 'error_records.xlsx')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Error File
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {jobData.rowDetails && jobData.rowDetails.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-slate-600" />
                  Row Details ({getFilteredRows().length})
                </h2>
                <button
                  onClick={() => fetchJobStatus(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-sm"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ADDED">Added Only</option>
                    <option value="FAILED">Failed Only</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Row Number</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-white">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getFilteredRows().length > 0 ? (
                      getFilteredRows().map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            Row {row.rowNumber}
                          </td>
                          <td className="px-6 py-4">
                            <span className={getRowStatusBadge(row.status)}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {row.message || '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                          No rows match the current filter
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-500">Job not found</div>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <StatusContent />
    </Layout>
  );
};

export default BulkStatus
