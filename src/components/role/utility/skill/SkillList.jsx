import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Award, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../Layout";

const SkillList = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    last: false,
  });

  const fetchSkills = async (page = 0) => {
    try {
      const response = await axios.get("http://localhost:8080/skills", {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { page, size: pagination.pageSize },
      });
      const { data, currentPage, pageSize, totalItems, totalPages, last } = response.data;
      setSkills(data || response.data);
      setPagination({ currentPage, pageSize, totalItems, totalPages, last });
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      fetchSkills(newPage);
    }
  };
  const deleteSkill = async (skillId) => {
    if (!authToken || !skillId) return navigate("/login");
    try {
      await axios.delete(`http://localhost:8080/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchSkills();
      toast.success("Skill Deleted Successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Error Deleting Skill !", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!authToken) return navigate("/login");
    fetchSkills();
  }, [authToken]);

  const SkillContent = () => (
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
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Skills Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                      View and manage all technical skills in the system
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/admin/skills/new")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Add New Skill
                </button>
              </div>
            </div>
          </div>

          {skills.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Skills Found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                Start by adding your first technical skill to the system.
              </p>
              <button
                onClick={() => navigate("/admin/skills/new")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add First Skill
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.skillId}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4">
                    <Trash2
                      className="text-white"
                      onClick={() => deleteSkill(skill.skillId)}
                    />
                    <div className="text-center">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">
                        {skill.skillName || skill.skill}
                      </h3>
                      <div className="text-slate-200 text-xs font-medium">
                        #{skill.skillId}
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
                        Technical Skill
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages >= 1 && (
            <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
                {Math.min(
                  (pagination.currentPage + 1) * pagination.pageSize,
                  pagination.totalItems
                )}{" "}
                of {pagination.totalItems} skills
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage + 1} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.last}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <SkillContent />
    </Layout>
  );
};

export default SkillList;
