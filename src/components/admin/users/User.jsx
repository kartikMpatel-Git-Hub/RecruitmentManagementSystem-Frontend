import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function User() {
  const navigate = useNavigate();
  const { userType, authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const updateUser = async (status, userId) => {
    if (!window.confirm("Are you sure you want to change this user's status?")) return;
    try {
      const formData = new FormData();
      formData.append(
        "user",
        new Blob([JSON.stringify({ userEnabled: status })], { type: "application/json" })
      );
      await axios.put(`http://localhost:8080/authentication/${userId}`, formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(users.map((user) => (user.userId === userId ? { ...user, userEnabled: status } : user)));
      toast.success("User Updated Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "User Updating failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:8080/authentication/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(users.filter((user) => user.userId !== id));
      toast.success("User Deleted Successfully!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error(error?.response?.data?.message || "User Deleting failed!", { position: "top-right", autoClose: 3000 });
      console.error(error);
    }
  };

  useEffect(() => {
    if (userType !== "admin") navigate("/home");
  }, [userType]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/authentication/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-mono">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <UserList users={users} onUpdate={updateUser} onDelete={deleteUser} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default User;
