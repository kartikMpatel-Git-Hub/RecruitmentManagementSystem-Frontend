import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../context/AuthContext";
import { toast } from "react-toastify";
import DocumentVerificationList from "./DocumentVerificationList";
import Layout from "../../Layout";
import { useNavigate } from "react-router-dom";

function DocumentVerification() {
  const { authToken ,userType} = useContext(AuthContext);
  const navigat = useNavigate()
  const [documentVerifications, setDocumentVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });
  const [filters, setFilters] = useState({
    status: "",
    page: 0,
    size: 10,
    sortBy: "documentVerificationId",
    sortDir: "desc",
  });

  const fetchDocumentVerifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      params.append("page", filters.page);
      params.append("size", filters.size);
      params.append("sortBy", filters.sortBy);
      params.append("sortDir", filters.sortDir);

      const response = await axios.get(
        `http://localhost:8080/document-verification?${params}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const { data, currentPage, pageSize, totalItems, totalPages, last } = response.data;
      setDocumentVerifications(data || []);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching document verifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const finalizeVerification = async (documentVerificationId) => {
    try {
      await axios.patch(
        `http://localhost:8080/document-verification/${documentVerificationId}/finalize`,
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchDocumentVerifications();
    } catch (error) {
      toast.error(error.response.data)
      console.error("Error finalizing verification:", error);
    }
  };

  const reviewDocument = async (
    documentId,
    documentStatus,
    rejectionReason = ""
  ) => {
    try {
      await axios.patch(
        `http://localhost:8080/document-verification/document/${documentId}/review`,
        {
          documentStatus,
          rejectionReason,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchDocumentVerifications();
      toast.success("review added")
      return true
    } catch (error) {
      console.error("Error reviewing document:", error);
      toast.error(error?.response?.data || "Review Document Failed")
      return false
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/document-verification/document/${documentId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      fetchDocumentVerifications();
      toast.success("document Deleted")
      return true
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(error?.response?.data || "Delete Document Failed")
      return false
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  useEffect(() => {
    if(!authToken) 
      navigat("/login");
    fetchDocumentVerifications();
  }, [filters, authToken]);

  return (
    <Layout>
      <DocumentVerificationList
        documentVerifications={documentVerifications}
        loading={loading}
        filters={filters}
        setFilters={setFilters}
        finalizeVerification={finalizeVerification}
        reviewDocument={reviewDocument}
        deleteDocument={deleteDocument}
        userType={userType}
        pagination={pagination}
        handlePageChange={handlePageChange}
      />
    </Layout>
  );
}

export default DocumentVerification;
