import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/bulk-entries';

export const bulkEntryService = {
  uploadFile: async (file, uploadedById) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/excel/upload/${uploadedById}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getJobStatus: async (jobId) => {
    const response = await axios.get(`${API_BASE_URL}/status/${jobId}`);
    return response.data;
  },
};