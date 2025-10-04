import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import Header from "./Header";
import DashboardData from "./DashboardData";

function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [users, setUsers] = React.useState([]); // State to store all users
  const [degrees, setDegrees] = useState([]); // State to store all degrees
  const [skills, setSkills] = useState([]); // State to store all skills

  useEffect(() => {
    if (userType !== "admin") {
      navigate("/home");
    }
  }, [userType, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/authentication/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degree/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDegrees(response.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8080/skill/", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSkills(response.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDegrees();
    fetchSkills();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-mono">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <DashboardData users={users} degrees={degrees} skills={skills} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
