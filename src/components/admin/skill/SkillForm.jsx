import React, { useState, useEffect } from "react";

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
    <div className="flex justify-center w-full mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {editingSkill ? "Update Skill" : "Add New Skill"}
        </h2>

        {/* Skill Field */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Skill Name</label>
          <input
            type="text"
            name="skill"
            value={formData.skill}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter skill name"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          {editingSkill && (
            <button
              type="button"
              onClick={() => setFormData({ skill: "", stream: "" })}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {editingSkill ? "Update" : "Add Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SkillForm;
