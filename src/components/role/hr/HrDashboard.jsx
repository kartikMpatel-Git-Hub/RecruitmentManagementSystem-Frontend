import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { HrLayout } from "./HrComponents";
import axios from "axios";
import HrDashboardData from "./HrDashboardData";
import Layout from "../utility/Layout";

function HrDashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]); // State to store all users
  const [degrees, setDegrees] = useState([]); // State to store all degrees
  const [skills, setSkills] = useState([]); // State to store all skills
  const [universities, setUniversities] = useState([]); // State to store all skills

  useEffect(() => {
    if (!authToken || userType !== "hr") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "hr") {
      fetchDegrees();
      fetchSkills();
      fetchUniversities();
      fetchCandidates()
    }
  }, [authToken, userType]);

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
    <Layout>
      <HrDashboardData
        candidates={candidates}
        degrees={degrees}
        skills={skills}
        universities={universities}
      />
    </Layout>
  );
}

export default HrDashboard;
