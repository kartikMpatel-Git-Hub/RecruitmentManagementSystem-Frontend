import React, { useState, useEffect } from "react";

function DegreeForm({ addDegree, updateDegree, editingDegree }) {
  const [formData, setFormData] = useState({
    degree: "",
    stream: "science",
  });

  useEffect(() => {
    if (editingDegree) {
      setFormData(editingDegree);
    } else {
      setFormData({ degree: "", stream: "science" });
    }
  }, [editingDegree]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim()) {
      alert("Degree name is required");
      return;
    }

    if (editingDegree) {
      await updateDegree(formData);
    } else {
      await addDegree(formData);
    }

    setFormData({ degree: "", stream: "science" });
  };

  return (
    <div className="flex justify-center w-full mt-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          {editingDegree ? "Update Degree" : "Add New Degree"}
        </h2>

        {/* Degree Name Field */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Degree Name
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Enter degree name"
          />
        </div>

        {/* Stream Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Stream</label>
          <select
            name="stream"
            value={formData.stream}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="science">Science</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          {editingDegree && (
            <button
              type="button"
              onClick={() => setFormData({ degree: "", stream: "science" })}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            {editingDegree ? "Update" : "Add Degree"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DegreeForm;
