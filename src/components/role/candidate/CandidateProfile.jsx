import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import "react-toastify/dist/ReactToastify.css";

function CandidateProfile() {
  const { authToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [allSkills, setAllSkills] = useState([]); 
  const [candidateSkills, setCandidateSkills] = useState([]); 
  const [selectedSkills, setSelectedSkills] = useState([]); 
  const [skillDetails, setSkillDetails] = useState({});
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [allEducations, setAllEducations] = useState([]);
  const [loadingEducations, setLoadingEducations] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [newEducation, setNewEducation] = useState({
    degree: "",
    university: "",
    percentage: "",
    passingYear: "",
  });
  const [editingEducation, setEditingEducation] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({
    personal: false,
    contact: false,
    professional: true,
    skills: true,
    education: true,
  });
  const [loading, setLoading] = useState(false);

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/candidates/resume/download/vv21dvtsjazpd5vto3dj.pdf`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(response);

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download file");
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
    }
  };

  const getCandidateSkills = async () => {
    if (!user.candidateId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/candidate-skills/candidate/${user.candidateId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const skills = response.data.data || [];
      setCandidateSkills(skills);
      setSelectedSkills(skills.map((s) => s.skill));

      const details = {};
      skills.forEach((skill) => {
        details[skill.skill] = {
          candidateSkillId: skill.candidateSkillId,
          proficiencyLevel: skill.proficiencyLevel || "BEGINNER",
          yearsOfExperience: skill.yearsOfExperience || 0,
        };
      });
      setSkillDetails(details);
    } catch (error) {
      console.error("Error fetching candidate skills:", error);
    }
  };

  const getAllSkills = async () => {
    try {
      setLoadingSkills(true);
      const response = await axios.get("http://localhost:8080/skills", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setAllSkills(response.data.data || response.data);
    } catch (error) {
    } finally {
      setLoadingSkills(false);
    }
  };
  const getAllDegrees = async () => {
    try {
      const response = await axios.get("http://localhost:8080/degrees", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDegrees(response.data.data);
    } catch (error) {
      console.error("Error fetching Degree:", error);
    }
  };
  const getAllUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/universities", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUniversities(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserEducations = async () => {
    if (!user.candidateId) return;
    setLoadingEducations(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/candidate-educations/candidate/${user.candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setAllEducations(response.data.data);
    } catch (error) {
    } finally {
      setLoadingEducations(false);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0"); 
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

  useEffect(() => {
    if (!user.candidateId) return;
    getAllDegrees();
    getAllUniversities();
    getUserEducations();
    getCandidateSkills();
  }, [user]);

  const handleSkillChange = async (skillId) => {
    setLoadingSkills(true);
    if (selectedSkills.includes(skillId)) {
      try {
        const skillDetail = skillDetails[skillId];
        if (skillDetail && skillDetail.candidateSkillId) {
          await axios.delete(
            `http://localhost:8080/candidate-skills/${skillDetail.candidateSkillId}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
        }
        setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
        setCandidateSkills(
          candidateSkills.filter((cs) => cs.skill !== skillId)
        );
        const newSkillDetails = { ...skillDetails };
        delete newSkillDetails[skillId];
        setSkillDetails(newSkillDetails);
        toast.success("Skill removed successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to remove skill!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      try {
        const skillData = {
          candidate: user.candidateId,
          skill: skillId,
          proficiencyLevel: "BEGINNER",
          yearsOfExperience: 0,
        };
        const response = await axios.post(
          `http://localhost:8080/candidate-skills/`,
          skillData,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setSelectedSkills([...selectedSkills, skillId]);
        setCandidateSkills([...candidateSkills, response.data]);
        setSkillDetails({
          ...skillDetails,
          [skillId]: {
            candidateSkillId: response.data.candidateSkillId,
            proficiencyLevel: "BEGINNER",
            yearsOfExperience: 0,
          },
        });
        toast.success("Skill added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to add skill!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
    setLoadingSkills(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const updateSkillDetail = async (skillId) => {
    try {
      setLoadingSkills(true);

      const skillDetail = skillDetails[skillId];
      if (skillDetail && skillDetail.candidateSkillId) {
        const updatedData = {
          candidate: user.candidateId,
          skill: skillId,
          proficiencyLevel: skillDetail.proficiencyLevel || "BEGINNER",
          yearsOfExperience: skillDetail.yearsOfExperience || 0,
        };

        await axios.put(
          `http://localhost:8080/candidate-skills/${skillDetail.candidateSkillId}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        toast.success("Skill updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.error("Skill not found for update!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to update skill!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoadingSkills(false);
    }
  };


  const handleAddEducation = async () => {
    if (!newEducation.degree || !newEducation.university) {
      toast.error("Please select both degree and university!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!newEducation.percentage) {
      toast.error("Please Enter Percentage !", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setLoadingEducations(true);
      const educationData = {
        candidate: user.candidateId,
        degree: parseInt(newEducation.degree),
        university: parseInt(newEducation.university),
        percentage: parseFloat(newEducation.percentage),
        passingYear: parseInt(newEducation.passingYear),
      };

      await axios.post(
        "http://localhost:8080/candidate-educations/",
        educationData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setNewEducation({
        degree: "",
        university: "",
        percentage: "",
        passingYear: "",
      });
      getUserEducations();
      toast.success("Education added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add education!",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoadingEducations(false);
    }
  };

  const handleUpdateEducation = async (
    educationId,
    degreeId,
    universityId,
    percentage,
    passingYear
  ) => {
    try {
      setLoadingEducations(true);
      const educationData = {
        candidate: user.candidateId,
        degree: parseInt(degreeId),
        university: parseInt(universityId),
        percentage: parseFloat(percentage),
        passingYear: parseInt(passingYear),
      };
      
      console.log(educationData);
      
      await axios.put(
        `http://localhost:8080/candidate-educations/${educationId}`,
        educationData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setEditingEducation(null);
      getUserEducations();
      toast.success("Education updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to update education!",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoadingEducations(false);
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
        `http://localhost:8080/candidates/${user.candidateId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error.response);

      toast.error(
        error?.response?.data?.message || "Failed to update profile!",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidateEducation = async (candidateEducationId) => {
    try {
      setLoadingEducations(true);
      await axios.delete(
        `http://localhost:8080/candidate-educations/${candidateEducationId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      getUserEducations();
      toast.success("Education Delete successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to Delete education!",
        { position: "top-right", autoClose: 3000 }
      );
    } finally {
      setLoadingEducations(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header title="My Profile" showBackButton={true} />

      <div className="max-w-7xl mx-100 px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={user.userImageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{user.userName}</h2>
              <p className="text-slate-200 mt-1">{user.userEmail}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <Section
              title="Personal Information"
              isCollapsed={collapsedSections.personal}
              onToggle={() => toggleSection("personal")}
            >
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

            <Section
              title="Contact Information"
              isCollapsed={collapsedSections.contact}
              onToggle={() => toggleSection("contact")}
            >
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

            <Section
              title="Professional Information"
              isCollapsed={collapsedSections.professional}
              onToggle={() => toggleSection("professional")}
            >
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

            <Section
              title="Skills"
              isCollapsed={collapsedSections.skills}
              onToggle={() => toggleSection("skills")}
            >
              <div className="space-y-4">
                {allSkills.map((skill) => (
                  <div
                    key={skill.skillId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <label className="flex items-center gap-3 cursor-pointer group mb-3">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.skillId)}
                        onChange={() => handleSkillChange(skill.skillId)}
                        className="hidden peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0 flex justify-center items-center transition-all duration-300 peer-checked:bg-slate-600 peer-checked:border-slate-600 group-hover:border-slate-500">
                        {selectedSkills.includes(skill.skillId) && (
                          <svg
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
                      <span className="text-gray-700 font-medium group-hover:text-gray-900">
                        {skill.skill}
                      </span>
                    </label>

                    {selectedSkills.includes(skill.skillId) && (
                      <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Proficiency Level
                            </label>
                            <select
                              value={
                                skillDetails[skill.skillId]?.proficiencyLevel ||
                                "BEGINNER"
                              }
                              onChange={(e) =>
                                setSkillDetails({
                                  ...skillDetails,
                                  [skill.skillId]: {
                                    ...skillDetails[skill.skillId],
                                    proficiencyLevel: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            >
                              <option value="BEGINNER">Beginner</option>
                              <option value="INTERMEDIATE">Intermediate</option>
                              <option value="ADVANCED">Advanced</option>
                              <option value="EXPERT">Expert</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Years of Experience
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="50"
                              value={
                                skillDetails[skill.skillId]
                                  ?.yearsOfExperience || 0
                              }
                              onChange={(e) =>
                                setSkillDetails({
                                  ...skillDetails,
                                  [skill.skillId]: {
                                    ...skillDetails[skill.skillId],
                                    yearsOfExperience: parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => updateSkillDetail(skill.skillId)}
                          disabled={loadingSkills}
                          className={`mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                            loadingSkills
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {loadingSkills ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {loadingSkills && (
                <div className="mt-6 text-center text-slate-600">
                  Updating skills...
                </div>
              )}
            </Section>

            <Section
              title="Education"
              isCollapsed={collapsedSections.education}
              onToggle={() => toggleSection("education")}
            >
              <div className="space-y-6">
                {allEducations.map((education) => (
                  <div
                    key={education.candidateEducationId}
                    className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Degree
                        </label>
                        <select
                          value={
                            editingEducation?.candidateEducationId ===
                            education.candidateEducationId
                              ? editingEducation.degree
                              : education.degree
                          }
                          onChange={(e) =>
                            setEditingEducation({
                              ...education,
                              degree: e.target.value,
                            })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        >
                          {degrees.map((degree) => (
                            <option
                              key={degree.degreeId}
                              value={degree.degreeId}
                            >
                              {degree.degree}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          University
                        </label>
                        <select
                          value={
                            editingEducation?.candidateEducationId ===
                            education.candidateEducationId
                              ? editingEducation.university
                              : education.university
                          }
                          onChange={(e) =>
                            setEditingEducation({
                              ...education,
                              university: e.target.value,
                            })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        >
                          {universities.map((university) => (
                            <option
                              key={university.universityId}
                              value={university.universityId}
                            >
                              {university.university}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Percentage
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={
                            editingEducation?.candidateEducationId ===
                            education.candidateEducationId
                              ? editingEducation.percentage
                              : education.percentage
                          }
                          onChange={(e) =>
                            setEditingEducation({
                              ...education,
                              percentage: e.target.value,
                            })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                          Passing Year
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2030"
                          value={
                            editingEducation?.candidateEducationId ===
                            education.candidateEducationId
                              ? editingEducation.passingYear
                              : education.passingYear
                          }
                          onChange={(e) =>
                            setEditingEducation({
                              ...education,
                              passingYear: e.target.value,
                            })
                          }
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
                        />
                      </div>
                    </div>
                    {editingEducation?.candidateEducationId ===
                    education.candidateEducationId ? (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() =>
                            handleUpdateEducation(
                              education.candidateEducationId,
                              editingEducation.degree,
                              editingEducation.university,
                              editingEducation.percentage,
                              editingEducation.passingYear
                            )
                          }
                          disabled={loadingEducations}
                          className={`py-2 px-4 rounded-xl font-semibold ${
                            loadingEducations
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {loadingEducations ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingEducation(null)}
                          className="py-2 px-4 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this education record?"
                              )
                            )
                              handleDeleteCandidateEducation(
                                education.candidateEducationId
                              );
                          }}
                          className="py-2 px-4 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Add New Education
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Degree
                      </label>
                      <select
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            degree: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-white"
                      >
                        <option value="">Select Degree</option>
                        {degrees.map((degree) => (
                          <option key={degree.degree} value={degree.degreeId}>
                            {degree.degree}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        University
                      </label>
                      <select
                        value={newEducation.university}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            university: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-white"
                      >
                        <option value="">Select University</option>
                        {universities.map((university) => (
                          <option
                            key={university.university}
                            value={university.universityId}
                          >
                            {university.university}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Percentage
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="Enter percentage"
                        value={newEducation.percentage}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            percentage: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        Passing Year
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max="2030"
                        placeholder="Enter year"
                        value={newEducation.passingYear}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            passingYear: e.target.value,
                          })
                        }
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddEducation}
                    disabled={loadingEducations}
                    className={`mt-4 py-3 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold shadow-lg ${
                      loadingEducations
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                  >
                    {loadingEducations ? "Adding..." : "Add Education"}
                  </button>
                </div>
              </div>
            </Section>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`flex-1 py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 font-semibold text-lg shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black hover:shadow-2xl transform hover:-translate-y-1"
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-2xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </div>
  );
}

const Section = ({ title, children, isCollapsed, onToggle }) => (
  <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full p-6 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
    >
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <svg
        className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
          isCollapsed ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    {!isCollapsed && <div className="px-6 pb-6 space-y-6">{children}</div>}
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-3">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
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
    <label className="block text-sm font-medium text-gray-900 mb-3">
      {label}
    </label>
    <div className="flex gap-6 mt-2">
      {["Male", "Female", "Other"].map((g) => (
        <label
          key={g}
          className="inline-flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={g}
            checked={value === g}
            onChange={onChange}
            className="w-4 h-4 text-slate-600 border-gray-300 focus:ring-slate-500"
          />
          <span className="text-gray-700 font-medium">{g}</span>
        </label>
      ))}
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-3">
      {label}
    </label>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
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
    <label className="block text-sm font-medium text-gray-900 mb-3">
      {label}
    </label>
    <input
      type="file"
      onChange={(e) => onChange(e.target.files[0])}
      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-slate-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
    />
  </div>
);

export default CandidateProfile;