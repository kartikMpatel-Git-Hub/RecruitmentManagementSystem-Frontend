import React, { useState, useEffect } from "react";
import { GraduationCap, Plus, Edit3, X, BookOpen } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
          {editingDegree ? <Edit3 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingDegree ? "Update Degree" : "Add New Degree"}
          </h2>
          <p className="text-gray-600">
            {editingDegree ? "Modify degree information" : "Create a new degree program"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Degree Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <GraduationCap className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-green-400 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
              placeholder="Enter degree name (e.g., Bachelor of Science)"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Stream
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <BookOpen className="w-5 h-5 text-gray-400" />
            </div>
            <select
              name="stream"
              value={formData.stream}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-green-400 transition-all duration-300 text-gray-900 bg-gray-50 focus:bg-white"
            >
              <option value="science">Science</option>
              <option value="commerce">Commerce</option>
              <option value="arts">Arts</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {editingDegree && (
            <button
              type="button"
              onClick={() => setFormData({ degree: "", stream: "science" })}
              className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {editingDegree ? (
              <><Edit3 className="w-4 h-4 mr-2" />Update Degree</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />Add Degree</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DegreeForm;
