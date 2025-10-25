import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import AdminLayout from "../../admin/AdminLayout";
import { RecruiterLayout } from "../../recruiter/RecruiterComponents";
import axios from "axios";

function SingleUserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, userType } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if(!authToken)
      navigate("/login");
    try {
      const response = await axios.get(`http://localhost:8080/users/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userType !== "admin" && userType !== "recruiter") 
      navigate("/");
  }, [userType]);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        </div>
      </div>
    );
  }

  const ProfileContent = () => (
    <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={user.userImageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-white">{user.userName}</h2>
              <p className="text-slate-200 mt-1">{user.userEmail}</p>
              <div className="flex items-center gap-2 mt-2">
                {user.userEnabled ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                    Inactive
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {user.role?.role || "User"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <Section title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField label="Username" value={user.userName} />
                <InfoField label="Email" value={user.userEmail} />
                <InfoField label="User ID" value={user.userId} />
                <InfoField 
                  label="Status" 
                  value={user.userEnabled ? "Active" : "Inactive"}
                  valueClass={user.userEnabled ? "text-green-600" : "text-red-600"}
                />
              </div>
            </Section>

            <Section title="Account Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="Role" 
                  value={user.role?.role || "Not assigned"} 
                />
                <InfoField 
                  label="Created Date" 
                  value={user.createdAt ? new Date(user.createdAt[0], user.createdAt[1]-1, user.createdAt[2]).toLocaleDateString() : "N/A"} 
                />
                <InfoField 
                  label="Updated Date" 
                  value={user.updatedAt ? new Date(user.updatedAt[0], user.updatedAt[1]-1, user.updatedAt[2]).toLocaleDateString() : "N/A"} 
                />
              </div>
            </Section>
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

export default SingleUserProfile
