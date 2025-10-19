import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [allSkills, setAllSkills] = useState([]); // Skills from DB
  const [selectedSkills, setSelectedSkills] = useState([]); // Selected skill IDs
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/authentication/profile`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setUser(response.data);
      const skills = response.data.candidateSkills || [];
      setSelectedSkills(skills.map((s) => s.skillId));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getAllSkills = async () => {
    try {
      setLoadingSkills(true);
      const response = await axios.get("http://localhost:8080/skill/", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAllSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${month}-${day}`;
  };

  useEffect(() => {
    if (authToken) {
      setLoading(true);
      getUserProfile();
      getAllSkills();
      setLoading(false);
    } else {
      logout();
      navigate("/login");
    }
  }, [authToken, navigate]);

  const handleSkillChange = (skillId) => {
    setLoadingSkills(true);
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
    setLoadingSkills(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSkillsSubmit = async () => {
    try {
      setLoadingSkills(true);
      const response = await axios.patch(
        `http://localhost:8080/candidate/${user.candidateId}`,
        selectedSkills,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error updating skills:", error);
    }
    finally {
      setTimeout(() => {
        setLoadingSkills(false);
      },500);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (resumeFile) formData.append("resume", resumeFile);
      formData.append(
        "candidate",
        new Blob([JSON.stringify(user)], { type: "application/json" })
      );

      const response = await axios.put(
        `http://localhost:8080/candidate/${user.candidateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    finally{
      setTimeout(() => {
        setLoading(false);
      },300);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-start p-6 text-gray-100">
      <div className="w-full max-w-5xl">
      {loading && <GlobalSpinner />}
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-red-700 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={user.userImageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-gray-900 shadow-lg object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{user.userName}</h1>
              <p className="text-gray-200 mt-1">{user.userEmail}</p>
            </div>
          </div>

          {/* Form Sections */}
          <div className="p-6 space-y-6">
            {/* Personal Info */}
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="candidateFirstName"
                  value={user.candidateFirstName}
                  onChange={inputChange}
                />
                <InputField
                  label="Middle Name"
                  name="candidateMiddleName"
                  value={user.candidateMiddleName}
                  onChange={inputChange}
                />
                <InputField
                  label="Last Name"
                  name="candidateLastName"
                  value={user.candidateLastName}
                  onChange={inputChange}
                />
                <DateField
                  label="Date of Birth"
                  name="candidateDateOfBirth"
                  value={formatDateForInput(user.candidateDateOfBirth)}
                  onChange={inputChange}
                />
                <GenderField
                  label="Gender"
                  name="candidateGender"
                  value={user.candidateGender}
                  onChange={inputChange}
                />
              </div>
            </Section>

            {/* Contact Info */}
            <Section title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Address"
                  name="candidateAddress"
                  value={user.candidateAddress}
                  onChange={inputChange}
                />
                <InputField
                  label="City"
                  name="candidateCity"
                  value={user.candidateCity}
                  onChange={inputChange}
                />
                <InputField
                  label="State"
                  name="candidateState"
                  value={user.candidateState}
                  onChange={inputChange}
                />
                <SelectField
                  label="Country"
                  name="candidateCountry"
                  value={user.candidateCountry}
                  onChange={inputChange}
                />
                <InputField
                  label="Zip Code"
                  name="candidateZipCode"
                  value={user.candidateZipCode}
                  onChange={inputChange}
                />
                <InputField
                  label="Phone Number"
                  name="candidatePhoneNumber"
                  value={user.candidatePhoneNumber}
                  onChange={inputChange}
                />
              </div>
            </Section>

            {/* Professional Info */}
            <Section title="Professional Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Username"
                  name="userName"
                  value={user.userName}
                  onChange={inputChange}
                />
                <InputField
                  label="Experience (Years)"
                  name="candidateTotalExperienceInYears"
                  value={user.candidateTotalExperienceInYears}
                  onChange={inputChange}
                  type="number"
                />
                <FileUpload
                  label="Resume"
                  onChange={(file) => setResumeFile(file)}
                />
              </div>
            </Section>

            {/* Skills Section */}
            {/* Skills Section */}
            <Section title="Skills">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allSkills.map((skill) => (
                  <label
                    key={skill.skillId}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    {/* Hidden native checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.skillId)}
                      onChange={() => handleSkillChange(skill.skillId)}
                      className="hidden peer"
                    />
                    {/* Custom styled checkbox */}
                    <div
                      className="w-6 h-6 border-2 border-gray-500 rounded-md flex-shrink-0 
                        flex justify-center items-center 
                        transition-all duration-300
                        peer-checked:bg-red-600 peer-checked:border-red-600
                        group-hover:border-red-500"
                    >
                      {selectedSkills.includes(skill.skillId) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-300 font-medium group-hover:text-white">
                      {skill.skill}
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleSkillsSubmit}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {loadingSkills && <Spinner />}
                Update Skills
              </button>
            </Section>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Update Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable components
const Section = ({ title, children }) => (
  <div className="bg-gray-900 p-6 rounded-xl shadow-sm space-y-4 border border-gray-700">
    <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
    {children}
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-red-500 transition"
    />
  </div>
);

const DateField = ({ label, name, value, onChange }) => (
  <InputField
    label={label}
    name={name}
    value={value}
    onChange={onChange}
    type="date"
  />
);

const GenderField = ({ label, name, value, onChange }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
    <div className="flex gap-4 mt-1">
      {["Male", "Female", "Other"].map((g) => (
        <label key={g} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={g}
            checked={value === g}
            onChange={onChange}
            className="form-radio h-4 w-4 text-red-500"
          />
          <span className="text-gray-300">{g}</span>
        </label>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-red-500 transition"
    >
      <option value="">Select Country</option>
      {[
        "India",
        "USA",
        "UK",
        "Canada",
        "Australia",
        "Germany",
        "France",
        "Other",
      ].map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  </div>
);

const FileUpload = ({ label, onChange }) => (
  <div className="md:col-span-2">
    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
    <input
      type="file"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:ring-2 focus:ring-red-500 transition"
    />
  </div>
);

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="w-6 h-6 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
  </div>
);

const GlobalSpinner = () => (
  <div className="fixed inset-0 bg-neutral-700 bg-opacity-50 flex justify-center items-center z-50">
    <div className="w-16 h-16 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
  </div>
);

export default Profile;
