import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardData from "./DashboardData";
import { ReviewerLayout } from "./ReviewerComponents";

function ReviewerDashboard() {
  const navigate = useNavigate();
  const { userType } = useContext(AuthContext);
  const { authToken } = useContext(AuthContext);

  const [positions, setPositions] = useState(null);
  const [applications,setApplications] = useState(null)  

  const fetchPositions = async ()=>{
    if(!authToken)
      return navigate("/login")
    try {
      const response = await axios.get("http://localhost:8080/positions",{
        headers:{
          Authorization:`Bearer ${authToken}`
        }
      })
      setPositions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchApplications = async ()=>{
    if(!authToken)
      return navigate("/login")
    try {
      const response = await axios.get("http://localhost:8080/applications",{
        headers:{
          Authorization:`Bearer ${authToken}`
        }
      })
      setApplications(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!authToken && userType !== "reviewer") {
      navigate("/login");
    }
    fetchPositions()
    fetchApplications()
  }, [authToken, userType]);


  return (
    <ReviewerLayout>
      <DashboardData
        positions={positions}
        applications={applications}
      />
    </ReviewerLayout>
  );
}

export default ReviewerDashboard;
