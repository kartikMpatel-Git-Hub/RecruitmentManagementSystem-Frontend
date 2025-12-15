import React, { useState, useContext } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { bulkEntryService } from '../../../services/bulkEntryService';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../Layout';

const BulkEntry = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid Excel file (.xlsx)');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!authToken) return navigate('/login');
    
    setLoading(true);
    setError('');
    
    try {
      const uploadedById = JSON.parse(localStorage.getItem('user'))?.id;
      const response = await bulkEntryService.uploadFile(file, uploadedById);
      setJobId(response);
      checkJobStatus(response);
      toast.success('File uploaded successfully!');
    } catch (err) {
      setError('Upload failed. Please try again.');
      toast.error('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const checkJobStatus = async (id) => {
    try {
      const status = await bulkEntryService.getJobStatus(id);
      setJobStatus(status);
      
      if (status.status === 'IN_PROGRESS') {
        setTimeout(() => checkJobStatus(id), 2000);
      }
    } catch (err) {
      setError('Failed to get job status');
    }
  };

  const downloadFile = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.click();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const BulkEntryContent = () => (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Bulk Entry Upload
              </h1>
              <p className="text-gray-600 text-lg">
                Upload Excel files for bulk data processing
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="mb-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Choose Excel File
                  </span>
                </label>
              </div>
              {file && (
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  {file.name}
                </div>
              )}
            </div>
            
            {error && (
              <div className="mt-2 text-red-600 text-sm">{error}</div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
          </div>

          {jobStatus && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  {getStatusIcon(jobStatus.status)}
                  <span className="ml-2 font-medium">Status: {jobStatus.status}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Job ID: {jobStatus.jobId}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{jobStatus.totalRows}</div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{jobStatus.successRows}</div>
                  <div className="text-sm text-gray-600">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{jobStatus.failedRows}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
              
              {jobStatus.status === 'COMPLETED' && (
                <div className="flex gap-4">
                  {jobStatus.successFilePath && (
                    <button
                      onClick={() => downloadFile(jobStatus.successFilePath, 'success_records.xlsx')}
                      className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Success File
                    </button>
                  )}
                  {jobStatus.errorFilePath && (
                    <button
                      onClick={() => downloadFile(jobStatus.errorFilePath, 'error_records.xlsx')}
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Error File
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <BulkEntryContent />
    </Layout>
  );
};

export default BulkEntry
