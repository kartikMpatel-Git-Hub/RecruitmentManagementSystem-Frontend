import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    userName: "",
    password: "",
  }); 
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); 
    setError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.userName.trim()) {
      errors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      errors.userName = "Username must be at least 3 characters";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    try {
      const response = await axios.post(
        "http://localhost:8080/authentication/login",
        formData
      );
      const token = response.data.token; 
      login(token); 
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-600">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-white mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                fieldErrors.userName ? "border-red-500" : "border-gray-300"
              } text-white`}
              placeholder="Enter your username"
            />
            {fieldErrors.userName && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.userName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.password ? "border-red-500" : "border-gray-300"
                } text-white`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12h.01M9 12h.01M12 12h.01M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 0115 0"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223a10.477 10.477 0 0116.04 0m-16.04 0a10.477 10.477 0 0116.04 0m-16.04 0a10.477 10.477 0 0116.04 0M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Create New account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign Up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
