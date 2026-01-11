import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import { AdminLayout } from "../../admin/AdminComponents";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const updateUserStatus = async (status, userId) => {
    if(!authToken)
      navigate("/login");
    
    if(status == undefined || status == null || !userId)
      return
    if (!window.confirm("Are you sure you want to change this user's status?")) return;
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({ userEnabled: status })], { type: "application/json" })
      );
      await axios.put(`http://localhost:8080/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(users.map((user) => (user.userId === userId ? { ...user, userEnabled: status } : user)));
      toast.success("User Status Updated Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "User Status Update failed!", { position: "top-right", autoClose: 3000 });
    }
  };

  const deleteUser = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(users.filter((user) => user.userId !== id));
      toast.success("User Deleted Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "User Deleting failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
    }
  }

  const viewUser = async (id) => {
    if(!authToken)
      navigate("/login");
    if(!id)
      return
    if (userType === "admin") {
      navigate(`../users/${id}`);
    }
    if (userType === "recruiter") {
      navigate(`../users/${id}`);
    }
  };

  const createUser = async (userData) => {
    if(!authToken)
      navigate("/login");
    try {
      await axios.post("http://localhost:8080/users", userData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("User Created Successfully! Credentials sent to email.", { position: "top-right", autoClose: 3000 });
      fetchUsers(pagination.currentPage);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.response?.data || "User Creation failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    if (userType !== "admin") 
      navigate("/");
  }, [userType]);

  const fetchUsers = async (page = 0) => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get("http://localhost:8080/users/non-candidates", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, size: pagination.pageSize },
      });
      const { data, currentPage, pageSize, totalItems, totalPages, last } = response.data;
      setUsers(data || []);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <AdminLayout>
      <UserList 
        users={users} 
        onUpdate={updateUserStatus} 
        onDelete={deleteUser}
        onView={viewUser}
        onCreate={createUser}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </AdminLayout>
  );
}

export default User;
