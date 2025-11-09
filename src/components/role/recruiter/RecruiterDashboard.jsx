import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardData from "./DashboardData";
import { RecruiterLayout } from "./RecruiterComponents";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [users, setUsers] = useState([]); 
  const [candidates, setCandidates] = useState([]);
  const [degrees, setDegrees] = useState([]); 
  const [skills, setSkills] = useState([]);
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    if (!authToken || userType !== "recruiter") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "recruiter") {
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
    <RecruiterLayout>
      <DashboardData
        candidates={candidates}
        degrees={degrees}
        skills={skills}
        universities={universities}
      />
    </RecruiterLayout>
  );
}

export default RecruiterDashboard;
