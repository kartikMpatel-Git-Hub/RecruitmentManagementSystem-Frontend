import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    image: null,
    role: "",
    candidateFirstName: "",
    candidateMiddleName: "",
    candidateLastName: "",
    candidateGender: "",
    candidateDateOfBirth: "",
    candidateAddress: "",
    candidateCity: "",
    candidateState: "",
    candidateCountry: "",
    candidateZipCode: "",
    candidatePhoneNumber: "",
    candidateTotalExperienceInYears: "",
    resume: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!validateForm()) return;

    try {
      if (formData.role === "ROLE_CANDIDATE") {
        // ✅ Candidate registration → /register
        const candidateDto = {
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
          candidateFirstName: formData.candidateFirstName,
          candidateMiddleName: formData.candidateMiddleName,
          candidateLastName: formData.candidateLastName,
          candidateGender: formData.candidateGender,
          candidateDateOfBirth: formData.candidateDateOfBirth,
          candidateAddress: formData.candidateAddress,
          candidateCity: formData.candidateCity,
          candidateState: formData.candidateState,
          candidateCountry: formData.candidateCountry,
          candidateZipCode: formData.candidateZipCode,
          candidatePhoneNumber: formData.candidatePhoneNumber,
          candidateTotalExperienceInYears:
            formData.candidateTotalExperienceInYears,
        };

        const submissionData = new FormData();
        submissionData.append(
          "candidate",
          new Blob([JSON.stringify(candidateDto)], {
            type: "application/json",
          })
        );
        submissionData.append("image", formData.image);
        submissionData.append("resume", formData.resume);

        await axios.post(
          "http://localhost:8080/candidate/register",
          submissionData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        toast.success("Candidate Registered Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        // ✅ All other roles → /authentication/register
        const user = {
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.userPassword,
        };

        const submissionData = new FormData();
        submissionData.append(
          "user",
          new Blob([JSON.stringify(user)], { type: "application/json" })
        );
        submissionData.append("image", formData.image);
        submissionData.append("role", formData.role);

        const response = await axios.post(
          "http://localhost:8080/authentication/register",
          submissionData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log(response);
        
        toast.success("User Created Successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setTimeout(() => navigator("/login"), 3000);
      requestFormReset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     const user = {
  //       userName: formData.userName,
  //       userEmail: formData.userEmail,
  //       userPassword: formData.userPassword,
  //     };
  //     const formDataToSubmit = new FormData();
  //     formDataToSubmit.append(
  //       "user",
  //       new Blob([JSON.stringify(user)], { type: "application/json" })
  //     );
  //     formDataToSubmit.append("image", formData.image);
  //     formDataToSubmit.append("role", formData.role);

  //     try {
  //       const response = await axios.post(
  //         "http://localhost:8080/authentication/register",
  //         formDataToSubmit,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //       toast.success("User Created Successfully!", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
  //       setTimeout(() => {
  //         navigator("/login");
  //       }, 3000);
  //     } catch (error) {
  //       toast.error(error?.response?.data?.message || "Registration failed!", {
  //         position: "top-right",
  //         autoClose: 3000,
  //       });
  //     } finally {
  //       requestFormReset();
  //     }
  //   }
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-600">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-screen mx-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Register
        </h2>
        <hr className="text-white p-1" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex flex-col items-center space-y-4">
              <label htmlFor="image" className="relative cursor-pointer">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-black rounded-full border border-gray-300">
                    <span className="text-sm">No Image</span>
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
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>

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
              className={`text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.userName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your username"
            />
            {errors.userName && (
              <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="userEmail"
              className="block text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleInputChange}
              className={`text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.userEmail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.userEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="userPassword"
              className="block text-sm font-medium text-white mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="userPassword"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleInputChange}
                className={`text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.userPassword ? "border-red-500" : "border-gray-300"
                }`}
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
            {errors.userPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.userPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-white mb-1"
            >
              Role
            </label>
            <div className="space-y-2">
              <select
                className={`bg-neutral-800 text-white w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userPassword} ? 'border-red-500' : 'border-gray-300`}
                onChange={handleInputChange}
                id="role"
                name="role"
                value={formData.role}
              >
                <option className="text-gray-200" value="">
                  -SELECT-
                </option>
                <option className="text-gray-200" value="ROLE_ADMIN">
                  ADMIN
                </option>
                <option className="text-gray-200" value="ROLE_NORMAL">
                  NORMAL
                </option>
                <option className="text-gray-200" value="ROLE_CANDIDATE">
                  CANDIDATE
                </option>
                <option className="text-gray-200" value="ROLE_RECRUITER">
                  RECRUITER
                </option>
                <option className="text-gray-200" value="ROLE_INTERVIEWER">
                  INTERVIEWER
                </option>
                <option className="text-gray-200" value="ROLE_HR">
                  HR
                </option>
              </select>
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>

          {formData.role === "ROLE_CANDIDATE" && (
            <>
              <h3 className="text-lg text-white mt-4 mb-2">
                Candidate Details
              </h3>

              {/* First Name */}
              <input
                type="text"
                name="candidateFirstName"
                placeholder="First Name"
                value={formData.candidateFirstName}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Middle Name */}
              <input
                type="text"
                name="candidateMiddleName"
                placeholder="Middle Name"
                value={formData.candidateMiddleName}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Last Name */}
              <input
                type="text"
                name="candidateLastName"
                placeholder="Last Name"
                value={formData.candidateLastName}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Gender Dropdown */}
              <label className="block text-sm font-medium text-white mb-1">
                Gender
              </label>
              <select
                name="candidateGender"
                value={formData.candidateGender}
                onChange={handleInputChange}
                className="bg-neutral-800 text-white w-full px-3 py-2 border rounded-md mb-2"
              >
                <option value="">-SELECT-</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/* DOB */}
              <input
                type="date"
                name="candidateDateOfBirth"
                value={formData.candidateDateOfBirth}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Address */}
              <input
                type="text"
                name="candidateAddress"
                placeholder="Address"
                value={formData.candidateAddress}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* City */}
              <input
                type="text"
                name="candidateCity"
                placeholder="City"
                value={formData.candidateCity}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* State */}
              <input
                type="text"
                name="candidateState"
                placeholder="State"
                value={formData.candidateState}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Country Dropdown */}
              <label className="block text-sm font-medium text-white mb-1">
                Country
              </label>
              <select
                name="candidateCountry"
                value={formData.candidateCountry}
                onChange={handleInputChange}
                className="bg-neutral-800 text-white w-full px-3 py-2 border rounded-md mb-2"
              >
                <option value="">-SELECT-</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>

              {/* Zip Code */}
              <input
                type="text"
                name="candidateZipCode"
                placeholder="Zip Code"
                value={formData.candidateZipCode}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Phone Number */}
              <input
                type="text"
                name="candidatePhoneNumber"
                placeholder="Phone Number"
                value={formData.candidatePhoneNumber}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />

              {/* Years of Experience */}
              <input
                type="number"
                name="candidateTotalExperienceInYears"
                placeholder="Years of Experience"
                value={formData.candidateTotalExperienceInYears}
                onChange={handleInputChange}
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
                min="0"
              />

              {/* Resume Upload */}
              <label className="block text-sm font-medium text-white mb-1">
                Upload Resume
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    resume: e.target.files[0],
                  }))
                }
                className="text-white w-full px-3 py-2 border rounded-md mb-2"
              />
              {errors.resume && (
                <p className="text-red-500 text-xs mt-1">{errors.resume}</p>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 font-medium"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in here
            </a>
          </p>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Register;
