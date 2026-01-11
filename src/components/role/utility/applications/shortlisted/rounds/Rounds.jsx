import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../../context/AuthContext";

function Rounds() {
  const { id } = useParams();
  const { authToken, userType } = useContext(AuthContext);
  const fetchRoundsForApplication = async () => {
    console.log(authToken);

    try {
      const response = await axios.get(
        `http://localhost:8080/rounds/applications/${id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoundsForApplication();
  }, []);

  return <div>Rounds</div>;
}

export default Rounds;
