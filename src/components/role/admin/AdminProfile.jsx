import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  User,
  Mail,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("profile");
  const [loading,setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfileData({
        userId: response.data.userId || "",
        userName: response.data.userName || "",
        userEmail: response.data.userEmail || "",
        image: null,
      });
      setImagePreview(response.data.userImageUrl || null);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  useEffect(() => {
    if(!authToken)
      return navigate("/login")
    fetchProfile()
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setProfileErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setProfileErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      setProfileData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      if (profileErrors.image) {
        setProfileErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!profileData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (profileData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!profileData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(profileData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,16}$/;

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!passwordRegex.test(passwordData.newPassword)) {
      newErrors.newPassword =
        "Password must be 8-16 characters with uppercase, lowercase, number, and special character";
    }

    if(passwordData.currentPassword === passwordData.newPassword)
        newErrors.newPassword = "New password must be different from current password";

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfile()) {
      try {
        const formData = new FormData();
        const userDto = {
          userName: profileData.userName,
          userEmail: profileData.userEmail,
        };

        formData.append(
          "user",
          new Blob([JSON.stringify(userDto)], { type: "application/json" })
        );

        if (profileData.image) {
          formData.append("image", profileData.image);
        }

        const response = await axios.put(
          `http://localhost:8080/users/${profileData.userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Update local state with new data
        setProfileData({
          userId: response.data.userId,
          userName: response.data.userName,
          userEmail: response.data.userEmail,
          image: null,
        });
        if (response.data.userImageUrl) {
          setImagePreview(response.data.userImageUrl);
        }

        toast.success("Profile updated successfully! Please login again.", {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Logout user after username change to refresh token
        setTimeout(() => {
          navigate("/logout");
        }, 3000);
      } catch (error) {
        toast.error(
          error?.response?.data || "Profile update failed!",
          { position: "top-right", autoClose: 3000 }
        );
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        await axios.put(
          `http://localhost:8080/authentication/change-password`,
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setPasswordData({   
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(
          error?.response?.data || "Password change failed!",
          { position: "top-right", autoClose: 3000 }
        );
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-4 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "profile"
                      ? "text-slate-800 border-b-2 border-slate-800 bg-slate-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === "password"
                      ? "text-slate-800 border-b-2 border-slate-800 bg-slate-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Change Password
                </button>
              </div>

              <div className="p-8">
                {activeTab === "profile" && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer group"
                      >
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile"
                            className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 group-hover:border-slate-400 transition-colors"
                          />
                        ) : (
                          <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border-4 border-gray-200 group-hover:border-slate-400 transition-colors">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {profileErrors.image && (
                      <p className="text-red-600 text-sm text-center flex items-center justify-center font-medium">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {profileErrors.image}
                      </p>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="userName"
                          value={profileData.userName}
                          onChange={handleProfileChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-400 placeholder-gray-500 ${
                            profileErrors.userName
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                          }`}
                          placeholder="Enter username"
                        />
                      </div>
                      {profileErrors.userName && (
                        <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {profileErrors.userName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="userEmail"
                          value={profileData.userEmail}
                          onChange={handleProfileChange}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                            profileErrors.userEmail
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                          }`}
                          placeholder="Enter email"
                        />
                      </div>
                      {profileErrors.userEmail && (
                        <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {profileErrors.userEmail}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!loading}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 px-6 rounded-2xl hover:from-slate-900 hover:to-black focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    >
                      <Save className="w-5 h-5 mr-2 inline" />
                      Update Profile
                    </button>
                  </form>
                )}

                {activeTab === "password" && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                            passwordErrors.currentPassword
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                            passwordErrors.newPassword
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-12 pr-14 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                            passwordErrors.confirmPassword
                              ? "border-red-300 bg-red-50 focus:border-red-400"
                              : "border-gray-200 bg-gray-50 focus:border-slate-400 focus:bg-white"
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 px-6 rounded-2xl hover:from-slate-900 hover:to-black focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    >
                      <Lock className="w-5 h-5 mr-2 inline" />
                      Change Password
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminProfile;
