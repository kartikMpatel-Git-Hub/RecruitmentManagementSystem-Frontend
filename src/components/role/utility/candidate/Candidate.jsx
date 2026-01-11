import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CandidateList from "./CandidateList";
import Layout from "../Layout";

function Candidate() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const updateCandidate = async (status, userId) => {
    if (!authToken) navigate("/login");
    if(status == undefined || status == null || !userId)
      return
    if (
      !window.confirm(
        "Are you sure you want to change this Candidate's status?"
      )
    )
      return;
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({ userEnabled: status })], {
          type: "application/json",
        })
      );
      await axios.put(`http://localhost:8080/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(
        candidates.map((candidate) =>
          candidate.userId === userId
            ? { ...candidate, userEnabled: status }
            : candidate
        )
      );
      toast.success("Candidate Status Updated Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Candidate Status Updating failed!",
        { position: "top-right", autoClose: 3000 }
      );
      console.error(error);
    }
  };

  const deleteCandidate = async (id) => {
    if (!authToken) navigate("/login");
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this Candidate?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(candidates.filter((candidate) => candidate.userId !== id));
      toast.success("Candidate Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Candidate Deleting failed!",
        { position: "top-right", autoClose: 3000 }
      );
      console.error(error);
    }
  };

  const viewCandidate = (id) => {
    if (!authToken) navigate("/login");
    if (!id) return;
    if (userType === "admin") {
      navigate(`../candidates/${id}`);
    }
    if (userType === "recruiter") {
      navigate(`../candidates/${id}`);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter" && userType !== "hr") navigate("/");
  }, [userType]);

  const fetchCandidates = async (page = 0) => {
    if (!authToken) return;
    try {
      const response = await axios.get(
        "http://localhost:8080/users/candidates",
        {
          headers: { Authorization: `Bearer ${authToken}` },
          params: { page, size: pagination.pageSize },
        }
      );
      const { data, currentPage, pageSize, totalItems, totalPages, last } = response.data;
      setCandidates(data || []);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchCandidates(newPage);
    }
  };

  return (
    <Layout>
      <CandidateList
        candidates={candidates}
        onUpdate={updateCandidate}
        onDelete={deleteCandidate}
        onView={viewCandidate}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Layout>
  );
}

export default Candidate;
