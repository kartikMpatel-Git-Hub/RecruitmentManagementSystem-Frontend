import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import { Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

function Login() {
  const { login,logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    userName: "",
    password: "",
  }); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" })); 
    setError("");
  };

  useEffect(() => {

    logout();

  }, []); 
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
    setLoading(true)
    e.preventDefault();
    if (!validateForm()) return; 

    try {
      const response = await axios.post(
        "http://localhost:8080/authentication/login",
        formData
      );
      const token = response.data.token; 
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.userType.toLowerCase();
      login(token, userType); 
      if (userType === "admin") 
        navigate("/admin");
      else if(userType === "recruiter")
        navigate("/recruiter");
      else if(userType === 'candidate')
        navigate("/candidate");
      else if(userType === 'reviewer')
        navigate("/reviewer");
      else if(userType === 'interviewer')
        navigate("/interviewer");
      else
        setError("Invalid Role !");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Please sign in to your account</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-3">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                    fieldErrors.userName 
                      ? "border-red-300 bg-red-50 focus:border-red-400" 
                      : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {fieldErrors.userName && (
                <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {fieldErrors.userName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                    fieldErrors.password 
                      ? "border-red-300 bg-red-50 focus:border-red-400" 
                      : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 px-6 rounded-2xl hover:from-slate-900 hover:to-black focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-2xl transform hover:-translate-y-1"
              }`}
            >
              {!loading ? <span>Sign In</span>:<span>Loading..</span> }
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-slate-800 hover:text-slate-900 font-semibold transition-colors underline decoration-2 underline-offset-2">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
