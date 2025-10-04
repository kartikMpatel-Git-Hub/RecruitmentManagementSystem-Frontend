import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userType, setUserType] = useState(null);

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

  function getUserType() {
    return userType;
  }

  return (
    <AuthContext.Provider value={{ authToken, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
