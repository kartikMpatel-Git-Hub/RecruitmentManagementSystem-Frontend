import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardData from "./DashboardData";
import { InterviewerLayout } from "./InterviewerComponents";

function InterviewerDashboard() {
  const navigate = useNavigate();
  const { userType,authToken,profileData } = useContext(AuthContext);

  const [interviews, setInterviews] = useState(null);

  const fetchInterviews = async () => {
    if (!authToken || !profileData.userId) 
      return navigate("/login");
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/interviewer/${profileData.userId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = response.data.data || [];
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviewers:", error);
    }
  };

  useEffect(() => {
    if (!authToken && userType !== "interviewer") {
      navigate("/login");
    }
    fetchInterviews();
  }, [authToken, userType]);

  return (
    <InterviewerLayout>
      <DashboardData 
        interviews={interviews}
      />
    </InterviewerLayout>
  );
}

export default InterviewerDashboard;
