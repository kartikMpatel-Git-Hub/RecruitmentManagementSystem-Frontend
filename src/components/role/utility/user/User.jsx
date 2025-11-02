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
      console.error(error);
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

  useEffect(() => {
    if (userType !== "admin") 
      navigate("/");
  }, [userType]);

  const fetchUsers = async () => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get("http://localhost:8080/users/non-candidates", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <AdminLayout>
      <UserList 
        users={users} 
        onUpdate={updateUserStatus} 
        onDelete={deleteUser}
        onView={viewUser}
      />
    </AdminLayout>
  );
}

export default User;
