import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HrLayout from "./HrLayout"
import axios from "axios";
import HrDashboardData from "./HrDashboardData"

function Dashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken || userType !== "hr") {
      navigate("/");
    }
  }, [authToken, userType, navigate]);

  useEffect(() => {
    if (authToken && userType === "hr") {
      fetchDashboardData();
    }
  }, [authToken, userType]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/dashboard/hr", {
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
      <HrLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      </HrLayout>
    );
  }

  return (
    <HrLayout>
      <HrDashboardData dashboardData={dashboardData} />
    </HrLayout>
  );
}

export default Dashboard;
