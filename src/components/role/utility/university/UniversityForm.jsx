import React, { useState, useEffect } from "react";
import { Building2, Plus, Edit3, X } from "lucide-react";

function UniversityForm({ addUniversity, updateUniversity, editingUniversity }) {
  const [formData, setFormData] = useState({
    university: "",
  });

  useEffect(() => {
    if (editingUniversity) {
      setFormData(editingUniversity);
    } else {
      setFormData({ university : "" });
    }
  }, [editingUniversity]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.university.trim()) {
      alert("University name is required");
      return;
    }
    try{
      if (editingUniversity) {
        await updateUniversity(formData);
        setFormData({ university : "" });
      } else {
        await addUniversity(formData);
        setFormData({ university : "" });
      }
    }catch(error){
    }

  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
          {editingUniversity ? <Edit3 className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {editingUniversity ? "Update University" : "Add New University"}
          </h2>
          <p className="text-gray-600">
            {editingUniversity ? "Modify university information" : "Create a new university entry"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            University Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-0 focus:border-orange-400 transition-all duration-300 text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white"
              placeholder="Enter university name (e.g., Harvard University)"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {editingUniversity && (
            <button
              type="button"
              onClick={() => setFormData({ university: "" })}
              className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold rounded-2xl hover:from-orange-700 hover:to-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {editingUniversity ? (
              <><Edit3 className="w-4 h-4 mr-2" />Update University</>
            ) : (
              <><Plus className="w-4 h-4 mr-2" />Add University</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UniversityForm;
