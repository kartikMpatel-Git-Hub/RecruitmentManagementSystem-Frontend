import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import AdminLayout from "../../admin/AdminLayout";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";
import { Download } from "lucide-react";
import axios from "axios";

function SingleCandidateProfile() {
    const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, userType } = useContext(AuthContext);
  const [candidate, setCandidate] = useState(null);
  const [educations, setEducations] = useState([]);
  const [candidateSkills, setCandidateSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/candidates/user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCandidate(response.data);
      
      // Fetch education data
      if (response.data.candidateId) {
        const educationResponse = await axios.get(
          `http://localhost:8080/candidate-educations/candidate/${response.data.candidateId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setEducations(educationResponse.data.data || []);
        
        // Fetch candidate skills
        const skillsResponse = await axios.get(
          `http://localhost:8080/candidate-skills/candidate/${response.data.candidateId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setCandidateSkills(skillsResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") 
      navigate("/");
  }, [userType]);

  useEffect(() => {
    if (id) fetchCandidate();
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Candidate not found</h2>
        </div>
      </div>
    );
  }

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length !== 3) return 'N/A';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const ProfileContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profile</h1>
        <p className="text-gray-600">View candidate information and details</p>
      </div> */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={candidate.userImageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white">
                {candidate.candidateFirstName} {candidate.candidateMiddleName} {candidate.candidateLastName}
              </h2>
              <p className="text-slate-200 mt-1">@{candidate.userName}</p>
              <p className="text-slate-200 mt-1">{candidate.userEmail}</p>
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {candidate.candidateTotalExperienceInYears || 0} Years Experience
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Candidate
                </span>
              </div>
            </div>
            {candidate.candidateResumeUrl && (
              <div className="flex-shrink-0">
                <a
                  href={candidate.candidateResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              </div>
            )}
          </div>

          <div className="p-8 space-y-8">
            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="First Name" value={candidate.candidateFirstName} />
                <InfoField label="Middle Name" value={candidate.candidateMiddleName} />
                <InfoField label="Last Name" value={candidate.candidateLastName} />
                <InfoField label="Gender" value={candidate.candidateGender} />
                <InfoField label="Date of Birth" value={formatDate(candidate.candidateDateOfBirth)} />
                <InfoField label="Phone Number" value={candidate.candidatePhoneNumber} />
              </div>
            </Section>

            <Section title="Contact Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Email" value={candidate.userEmail} />
                <InfoField label="Address" value={candidate.candidateAddress} />
                <InfoField label="City" value={candidate.candidateCity} />
                <InfoField label="State" value={candidate.candidateState} />
                <InfoField label="Country" value={candidate.candidateCountry} />
                <InfoField label="Zip Code" value={candidate.candidateZipCode} />
              </div>
            </Section>

            <Section title="Professional Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Username" value={candidate.userName} />
                <InfoField 
                  label="Experience" 
                  value={`${candidate.candidateTotalExperienceInYears || 0} ${candidate.candidateTotalExperienceInYears === 1 ? 'Year' : 'Years'}`} 
                />
                <InfoField label="Candidate ID" value={candidate.candidateId} />
              </div>
            </Section>

            {candidateSkills && candidateSkills.length > 0 && (
              <Section title="Skills & Expertise">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidateSkills.map((candidateSkill, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{candidateSkill.skillName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          candidateSkill.proficiencyLevel === 'EXPERT' ? 'bg-green-100 text-green-800' :
                          candidateSkill.proficiencyLevel === 'ADVANCED' ? 'bg-blue-100 text-blue-800' :
                          candidateSkill.proficiencyLevel === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {candidateSkill.proficiencyLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {candidateSkill.yearsOfExperience} {candidateSkill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {educations && educations.length > 0 && (
              <Section title="Education">
                <div className="space-y-6">
                  {educations.map((education, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <InfoField label="Degree" value={education.degreeName} />
                        <InfoField label="University" value={education.universityName} />
                        <InfoField label="Percentage" value={`${education.percentage}%`} />
                        <InfoField label="Passing Year" value={education.passingYear} />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
    </div>
  );

  return (
    userType === "admin" ? (
      <AdminLayout>
        <ProfileContent />
      </AdminLayout>
    ) : userType === "recruiter" ? (
      <RecruiterLayout>
        <ProfileContent />
      </RecruiterLayout>
    ) : null
  );
}

const Section = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
    {children}
  </div>
);

const InfoField = ({ label, value, valueClass = "text-gray-900" }) => (
  <div className="flex flex-col">
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className={`font-semibold ${valueClass}`}>{value || "Not provided"}</p>
  </div>
);

export default SingleCandidateProfile
