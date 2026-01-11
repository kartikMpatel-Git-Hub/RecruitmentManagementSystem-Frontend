import { createContext, useState,useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [profileData, setProfileData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    image: null,
  });

  const login = (token, type) => {
    setAuthToken(token);
    setUserType(type);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setAuthToken(null);
    setUserType(null);
    localStorage.removeItem("authToken");
  };

  const fetchProfile = async () => {
    if(!authToken) return;
    try {
      const response = await axios.get(`http://localhost:8080/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfileData({
        userId: response.data.userId || response.data.candidateId || "",
        userName: response.data.userName || "",
        userEmail: response.data.userEmail || "",
        image: response.data.userImageUrl || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {  
    fetchProfile()     
  }, [authToken]);

  function getUserType() {
    return userType;
  }

  return (
    <AuthContext.Provider value={{ authToken, userType, login, logout ,profileData}}>
      {children}
    </AuthContext.Provider>
  );
};
