import React, { useContext, useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

function Interview() {
  const { profileData, userType, authToken } = useContext(AuthContext);
  const [interviews,setInterviews] = useState([])
  const navigator = useNavigate();

  const fetchInterviews = async () => {
    if (!authToken || !profileData.userId) return navigator("/login");
    try {
      const response = await axios.get(`http://localhost:8080/interviews/interviewer/${profileData.userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = response.data.data || [];
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviewers:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div>
      <h2>Interviews</h2>
      <ul>
        {interviews.map((interview) => (
          <li key={interview.interviewId}>{interview.interviewStatus}</li>
        ))}
      </ul>
    </div>
  );
}

export default Interview;
