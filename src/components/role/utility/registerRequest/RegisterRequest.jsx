import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../admin/AdminComponents";
import axios from "axios";
import RegisterRequestList from "./RegisterRequestList"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RegisterRequest() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);


  const rejectRequest = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await axios.delete(`http://localhost:8080/requests/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRequests(requests.filter((requests) => requests.registerId !== id));
      toast.success("Request Reject Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Request Rejection failed!", { position: "top-right", autoClose: 3000 });
    }
  }
  const acceptRequest = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    try {
      await axios.get(`http://localhost:8080/requests/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRequests(requests.filter((requests) => requests.registerId !== id));
      toast.success("Request Accept Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Request Accepting failed!", { position: "top-right", autoClose: 3000 });
    }
  }

  useEffect(() => {
    if (userType !== "admin") 
      navigate("/");
  }, [userType]);

  const fetchRequests = async () => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get("http://localhost:8080/requests", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  return (
    <AdminLayout>
      <RegisterRequestList
        requests={requests} 
        acceptRequest={acceptRequest} 
        rejectRequest={rejectRequest}
      />
    </AdminLayout>
  );
}

export default RegisterRequest;
