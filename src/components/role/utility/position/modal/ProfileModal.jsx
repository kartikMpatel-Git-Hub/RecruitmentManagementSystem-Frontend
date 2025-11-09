import React, { useEffect,useState } from "react";
import { Download, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProfileModal({
  closeProfileModal,
  profileLoading,
  candidateProfile,
  candidateSkills,
  candidateEducations,
}) {
  const[basePath,setBasePath]=useState("")
  const fetchBasePath = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/admin/")) {
      setBasePath("/admin")
    } else if (currentPath.includes("/recruiter/")) {
        setBasePath("/recruiter")
    } else if (currentPath.includes("/reviewer/")) {
        setBasePath("/reviewer")
    } else {
        setBasePath("/")
    }
  };
  useEffect(() => {
    fetchBasePath();
  }, []);
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeProfileModal}
        ></div>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {profileLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading candidate profile...</p>
              </div>
            ) : candidateProfile ? (
              <div>
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex items-center justify-between rounded-t-3xl">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        candidateProfile.userImageUrl || "/default-avatar.png"
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {candidateProfile.candidateFirstName}{" "}
                        {candidateProfile.candidateLastName}
                      </h2>
                      <p className="text-slate-200">
                        @{candidateProfile.userName}
                      </p>
                      <p className="text-slate-200">
                        {candidateProfile.userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {candidateProfile.candidateResumeUrl && (
                      <a
                        href={candidateProfile.candidateResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white text-slate-800 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Resume
                      </a>
                    )}
                    <button
                      onClick={closeProfileModal}
                      className="p-2 hover:bg-slate-700 rounded-full"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          First Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {candidateProfile.candidateFirstName ||
                            "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Last Name
                        </p>
                        <p className="font-semibold text-gray-900">
                          {candidateProfile.candidateLastName || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Gender
                        </p>
                        <p className="font-semibold text-gray-900">
                          {candidateProfile.candidateGender || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Experience
                        </p>
                        <p className="font-semibold text-gray-900">
                          {candidateProfile.candidateTotalExperienceInYears ||
                            0}{" "}
                          Years
                        </p>
                      </div>
                    </div>
                  </div>

                  {candidateSkills?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Skills
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {candidateSkills.map((skill, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-3 border"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {skill.skillName}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  skill.proficiencyLevel === "EXPERT"
                                    ? "bg-green-100 text-green-800"
                                    : skill.proficiencyLevel === "ADVANCED"
                                    ? "bg-blue-100 text-blue-800"
                                    : skill.proficiencyLevel === "INTERMEDIATE"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {skill.proficiencyLevel}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {skill.yearsOfExperience} years experience
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidateEducations?.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Education
                      </h3>
                      <div className="space-y-4">
                        {candidateEducations.map((education, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg p-4 border border-l-4 border-l-blue-500"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Degree
                                </p>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {education.degreeName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  University
                                </p>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {education.universityName}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Percentage
                                </p>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {education.percentage}%
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-600">
                                  Year
                                </p>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {education.passingYear}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      navigate(
                        `${basePath}/candidates/${candidateProfile.candidateId}?page=applications`
                      );
                    }}
                    className="flex py-5 px-8 m-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 font-semibold shadow-lg"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-600">Candidate profile not found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileModal;
