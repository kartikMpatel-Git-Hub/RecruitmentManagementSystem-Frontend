import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Building2, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../Layout";

const UniversityList = () => {
  const { authToken, userType } = useContext(AuthContext);
  const navigate = useNavigate();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get("http://localhost:8080/universities", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUniversities(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };
  const deleteUniversity = async (degreeId) => {
    if(!authToken || !degreeId)
      return navigate("/login")
    try {
      await axios.delete(`http://localhost:8080/universities/${degreeId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      toast.success("University Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      fetchUniversities()
    } catch (error) {
      toast.error("Error Deleting University !", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error fetching universities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchUniversities();
  }, [authToken]);

  const UniversityContent = () => (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="p-100 h-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
        </div>
      ) : (
        <div>
          <div className="mb-10">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      University Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                      View and manage all educational institutions in the system
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/admin/universities/new")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add New University
                </button>
              </div>
            </div>
          </div>

          {universities.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Universities Found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Start by adding your first educational institution to the
                system.
              </p>
              <button
                onClick={() => navigate("/admin/universities/new")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add First University
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((university) => (
                <div
                  key={university.universityId}
                  className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
                    <Trash2
                      className="text-white"
                      onClick={() => deleteUniversity(university.universityId)}
                    />
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {university.university}
                      </h3>
                      <div className="text-slate-200 text-sm font-medium">
                        ID: #{university.universityId}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm font-medium">
                        <Building2 className="w-4 h-4" />
                        Institution
                      </div>
                      <p className="text-gray-600 text-sm">
                        Educational institution
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <UniversityContent />
    </Layout>
  );
};

export default UniversityList;
