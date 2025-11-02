import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Award, Plus, Edit3, X, ArrowLeft } from "lucide-react";

function SkillForm({ addSkill }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    skill: "",
    stream: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skill.trim()) {
      alert("Skill name is required");
      return;
    }

    await addSkill(formData);

    setFormData({ skill: "", stream: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/admin/skills')}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </button>
        
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Add New Skill</h1>
                <p className="text-slate-200">Create a new technical skill for the system</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Skill Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Award className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="skill"
                  value={formData.skill}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white shadow-sm"
                  placeholder="Enter skill name (e.g., JavaScript, Python, React)"
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Enter the technical skill or competency name</p>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Skill
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SkillForm;
