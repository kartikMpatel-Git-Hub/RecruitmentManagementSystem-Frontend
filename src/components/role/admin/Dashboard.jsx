import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import axios from "axios";
import DashboardData from "./DashboardData";

function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]); // State to store all users
  const [candidates, setCandidates] = useState([]); // State to store all users
  const [degrees, setDegrees] = useState([]); // State to store all degrees
  const [skills, setSkills] = useState([]); // State to store all skills
  const [universities, setUniversities] = useState([]); // State to store all skills

  useEffect(() => {
    if (!authToken || userType !== "admin") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "admin") {
      fetchUsers();
      fetchDegrees();
      fetchSkills();
      fetchUniversities();
      fetchCandidates()
    }
  }, [authToken, userType]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/non-candidates",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/users/candidates",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCandidates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degrees", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDegrees(response.data.data || []);
    } catch (error) {
      console.error("Error fetching degrees:", error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("http://localhost:8080/skills", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/universities", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUniversities(response.data.data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  return (
    <AdminLayout>
      <DashboardData
        candidates={candidates}
        users={users}
        degrees={degrees}
        skills={skills}
        universities={universities}
      />
    </AdminLayout>
  );
}

export default Dashboard;
