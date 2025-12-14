import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewerLayout from "./ReviewerLayout";
import axios from "axios";
import DashboardData from "./DashboardData";

function ReviewerDashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken || userType !== "reviewer") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "reviewer") {
      fetchDashboardData();
    }
  }, [authToken, userType]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/reviewer", {
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
      <ReviewerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </ReviewerLayout>
    );
  }

  return (
    <ReviewerLayout>
      <DashboardData dashboardData={dashboardData} />
    </ReviewerLayout>
  );
}

export default ReviewerDashboard;
