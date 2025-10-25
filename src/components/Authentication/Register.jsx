import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserPlus, Plus, AlertCircle, User, Mail, Lock, CheckCircle, Eye, EyeOff, Briefcase } from "lucide-react";

function Register() {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    image: null,
    role: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const requestFormReset = () => {
    setFormData({
      userName: "",
      userEmail: "",
      userPassword: "",
      confirmPassword: "",
      image: null,
      role: "",
    });
    setImagePreview(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowed.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload resume in PDF or DOC/DOCX format",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          resume: "Resume size should be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, resume: file }));
      if (errors.resume) {
        setErrors((prev) => ({ ...prev, resume: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/;

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    if (!formData.userPassword) {
      newErrors.userPassword = "Password is required";
    } else if (!passwordRegex.test(formData.userPassword)) {
      newErrors.userPassword =
        "Password must be 8-16 characters long, include uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.confirmPassword !== formData.userPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.image) {
      newErrors.image = "Please select an image";
    }

    if (!formData.role || formData.role === "") {
      newErrors.role = "Please select an Role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const user = {
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPassword: formData.userPassword,
      };
      const formDataToSubmit = new FormData();
      formDataToSubmit.append(
        "user",
        new Blob([JSON.stringify(user)], { type: "application/json" })
      );
      formDataToSubmit.append("image", formData.image);
      formDataToSubmit.append("role", formData.role);

      try {
        const response = await axios.post(
          "http://localhost:8080/authentication/register",
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("User Created Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigator("/login");
          requestFormReset();
        }, 3000);
      } catch (error) {
        console.log(error.response.data);
        toast.error(error?.response?.data || "Registration failed!", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join us today and get started</p>
        </div>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <label htmlFor="image" className="relative cursor-pointer group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 group-hover:border-slate-400 transition-colors"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border-4 border-gray-200 group-hover:border-slate-400 transition-colors">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-red-600 text-sm text-center flex items-center justify-center font-medium">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.image}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      errors.userName 
                        ? "border-red-300 bg-red-50 focus:border-red-400" 
                        : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                    }`}
                    placeholder="Enter username"
                  />
                </div>
                {errors.userName && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.userName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-900 mb-3">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                      errors.userEmail 
                        ? "border-red-300 bg-red-50 focus:border-red-400" 
                        : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                    }`}
                    placeholder="Enter email"
                  />
                </div>
                {errors.userEmail && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.userEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="userPassword" className="block text-sm font-medium text-gray-900 mb-3">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="userPassword"
                    name="userPassword"
                    value={formData.userPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                      errors.userPassword 
                        ? "border-red-300 bg-red-50 focus:border-red-400" 
                        : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.userPassword && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.userPassword}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                      errors.confirmPassword 
                        ? "border-red-300 bg-red-50 focus:border-red-400" 
                        : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-3">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 bg-gray-50 ${
                    errors.role 
                      ? "border-red-300 bg-red-50 focus:border-red-400" 
                      : "border-gray-200 focus:border-slate-400 focus:bg-white"
                  }`}
                  onChange={handleInputChange}
                  id="role"
                  name="role"
                  value={formData.role}
                >
                  <option value="">Select Role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="NORMAL">Normal</option>
                  <option value="CANDIDATE">Candidate</option>
                  <option value="RECRUITER">Recruiter</option>
                  <option value="INTERVIEWER">Interviewer</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.role}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-2xl transform hover:-translate-y-1"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-slate-800 hover:text-slate-900 font-semibold transition-colors underline decoration-2 underline-offset-2">
                Sign In
              </a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
