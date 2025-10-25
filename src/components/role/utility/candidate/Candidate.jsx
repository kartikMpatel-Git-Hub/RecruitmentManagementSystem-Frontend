import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../admin/AdminLayout";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CandidateList from "./CandidateList";

function Candidate() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);

  const updateCandidate = async (status, userId) => {
    if(!authToken)
      navigate("/login");
    if(!userId || !status)
      return
    if (!window.confirm("Are you sure you want to change this Candidate's status?")) return;
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({ userEnabled: status })], { type: "application/json" })
      );
      await axios.put(`http://localhost:8080/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(candidates.map((candidate) => (candidate.userId === userId ? { ...candidate, userEnabled: status } : candidate)));
      toast.success("Candidate Status Updated Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Candidate Status Updating failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
    }
  };

  const deleteCandidate = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    if (!window.confirm("Are you sure you want to delete this Candidate?")) return;
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(candidates.filter((candidate) => candidate.userId !== id));
      toast.success("Candidate Deleted Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Candidate Deleting failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
    }
  };

  const viewCandidate = (id) => {
    if(!authToken)
      navigate("/login");
    if (!id) return;
    if (userType === "admin") {
      navigate(`../candidates/${id}`);
    }
    if (userType === "recruiter") {
      navigate(`../candidates/${id}`);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") 
      navigate("/");
  }, [userType]);

  const fetchCandidates = async () => {
    if (!authToken) return;
    try {
      const response = await axios.get("http://localhost:8080/users/candidates", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setCandidates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  return (
    userType === "admin" ?(
      <AdminLayout>
        <CandidateList
          candidates={candidates}
          onUpdate={updateCandidate}
          onDelete={deleteCandidate}
          onView={viewCandidate}
        />
      </AdminLayout>
    ):
    userType === 'recruiter' && (
      <RecruiterLayout>
        <CandidateList
          candidates={candidates}
          onUpdate={updateCandidate}
          onDelete={deleteCandidate}
          onView={viewCandidate}
        />
      </RecruiterLayout>
    )
  );
}

export default Candidate;
