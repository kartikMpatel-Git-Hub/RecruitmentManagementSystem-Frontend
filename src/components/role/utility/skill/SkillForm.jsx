import React, { useState, useEffect } from "react";
import { Award, Plus, Edit3, X } from "lucide-react";

function SkillForm({ addSkill, updateSkill, editingSkill }) {
  const [formData, setFormData] = useState({
    skill: "",
    stream: "",
  });

  useEffect(() => {
    if (editingSkill) {
      setFormData({
        skill: editingSkill.skill || "",
        stream: editingSkill.stream || "",
      });
    }
  }, [editingSkill]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.skill.trim()) return;

    if (editingSkill) {
      updateSkill({ ...editingSkill, ...formData });
    } else {
      addSkill(formData);
    }

    setFormData({ skill: "", stream: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
          {editingSkill ? <Edit3 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingSkill ? "Update Skill" : "Add New Skill"}
          </h2>
          <p className="text-gray-600">
            {editingSkill ? "Modify skill information" : "Create a new skill entry"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
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
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-purple-400 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
              placeholder="Enter skill name (e.g., JavaScript, Python)"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {editingSkill && (
            <button
              type="button"
              onClick={() => setFormData({ skill: "", stream: "" })}
              className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {editingSkill ? (
              <><Edit3 className="w-4 h-4 mr-2" />Update Skill</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />Add Skill</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SkillForm;
