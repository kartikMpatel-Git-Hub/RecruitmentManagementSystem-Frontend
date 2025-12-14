import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InterviewerLayout from "./InterviewerLayout"
import DashboardData from "./DashboardData"

function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken || userType !== "interviewer") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "interviewer") {
      fetchDashboardData();
    }
  }, [authToken, userType]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/interviewer", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <InterviewerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </InterviewerLayout>
    );
  }

  return (
    <InterviewerLayout>
      <DashboardData dashboardData={dashboardData} />
    </InterviewerLayout>
  );
}

export default Dashboard;
