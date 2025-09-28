import React, { useContext, useEffect,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const { authToken, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  

  const [user, setUser] = useState({
    userName: "",
    userEmail: "",
    role: [],
  });

  const getUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8080/authentication/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = response.data;
      if (data) {
        setUser({
          userName: data.userName,
          userEmail: data.userEmail,
          role: data.roles.map(r => r.role).join(", "),
        });
      } else {
        console.error("Failed to fetch user profile");
      }
    }
    catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    if (authToken) {
      getUserProfile();
    } else {
        console.error("Invalid token format");
        logout();
        navigate("/login");
      }
    }, [authToken, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Profile
        </h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Username:</p>
            <p className="text-lg font-medium text-gray-800">{user.userName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email:</p>
            <p className="text-lg font-medium text-gray-800">{user.userEmail}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role:</p>
            <p className="text-lg font-medium text-gray-800">{user.role}</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;