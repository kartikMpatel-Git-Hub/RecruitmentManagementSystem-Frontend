import React, { useState, useEffect } from "react";
import { User, Mail, Camera, X, Save } from "lucide-react";

function UserForm({ updateUser, editingUser, setEditingUser }) {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        userName: editingUser.userName || "",
        userEmail: editingUser.userEmail || "",
        image: null,
      });
      setImagePreview(editingUser.userImageUrl || null);
    }
  }, [editingUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!emailRegex.test(formData.userEmail)) {
      newErrors.userEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await updateUser(editingUser.userId, formData);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFormData({ userName: "", userEmail: "", image: null });
    setImagePreview(null);
    setErrors({});
    setEditingUser(null);
  };

  if (!editingUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Update User</h2>
              <p className="text-gray-600">Modify user information</p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <label htmlFor="image" className="relative cursor-pointer group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border-4 border-gray-200 group-hover:border-blue-400 transition-colors"
                />
              ) : (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full border-4 border-gray-200 group-hover:border-blue-400 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
          {errors.image && (
            <p className="text-red-600 text-sm text-center font-medium">
              {errors.image}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                  errors.userName 
                    ? "border-red-300 bg-red-50 focus:border-red-400" 
                    : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                }`}
                placeholder="Enter username"
              />
            </div>
            {errors.userName && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.userName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-500 ${
                  errors.userEmail 
                    ? "border-red-300 bg-red-50 focus:border-red-400" 
                    : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                }`}
                placeholder="Enter email"
              />
            </div>
            {errors.userEmail && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                {errors.userEmail}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Save className="w-4 h-4 mr-2" />
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;