import React, { useState } from 'react';
import {
  Users,
  Trash2,
  Power,
  PowerOff,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  UserPlus,
} from "lucide-react";

function UserList({
  users,
  onUpdate,
  onDelete,
  onView,
  onCreate,
  pagination,
  onPageChange,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: '',
    userEmail: '',
    userRole: 'HR'
  });

  const availableRoles = ['HR', 'RECRUITER', 'INTERVIEWER', 'REVIEWER'];

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.userName || !newUser.userEmail || !newUser.userRole) return;
    
    setCreating(true);
    const success = await onCreate(newUser);
    setCreating(false);
    
    if (success) {
      setShowCreateModal(false);
      setNewUser({ userName: '', userEmail: '', userRole: 'HR' });
    }
  };

  const getRoleClasses = (role) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-slate-100 text-slate-800";
      case "hr":
        return "bg-slate-100 text-slate-800";
      case "recruiter":
        return "bg-slate-100 text-slate-800";
      case "employee":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  User Management
                </h1>
                <p className="text-gray-600 text-lg">
                  View and manage all system users
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              Add New User
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Users Found
            </h3>
            <p className="text-gray-600 text-lg">
              There are no users in the system at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {users.map((user) => {
              const {
                userId,
                userName,
                userEmail,
                role,
                userImageUrl,
                userEnabled,
              } = user;

              return (
                <div
                  key={userId}
                  className="bg-white rounded-3xl p-6 flex flex-col items-center text-center hover:shadow-xl transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                >
                  <div className="w-20 h-20 mb-4">
                    {userImageUrl ? (
                      <img
                        src={userImageUrl}
                        alt="User"
                        className="w-full h-full rounded-full object-cover border-4 border-slate-200 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {userName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-1">
                    {userEmail}
                  </p>

                  <div className="flex flex-col items-center space-y-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleClasses(
                        role.role
                      )}`}
                    >
                      {role.role}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userEnabled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {userEnabled ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => onView(userId)}
                      className="flex items-center justify-center w-full px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="text-xs">View</span>
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdate(!userEnabled, userId)}
                        className={`flex items-center justify-center flex-1 px-3 py-2 rounded-xl text-white font-medium transition-all duration-200 ${
                          userEnabled
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {userEnabled ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(userId)}
                        className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages >= 1 && (
          <div className="flex items-center justify-between px-6 py-4 mt-6 bg-white rounded-2xl shadow-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {pagination.currentPage * pagination.pageSize + 1} to{" "}
              {Math.min(
                (pagination.currentPage + 1) * pagination.pageSize,
                pagination.totalItems
              )}{" "}
              of {pagination.totalItems} users
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.last}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          ></div>
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    Add New User
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newUser.userName}
                    onChange={(e) => setNewUser({ ...newUser, userName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newUser.userEmail}
                    onChange={(e) => setNewUser({ ...newUser, userEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUser.userRole}
                    onChange={(e) => setNewUser({ ...newUser, userRole: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    required
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> A password will be auto-generated and sent to the user's email address.
                  </p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newUser.userName || !newUser.userEmail}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg flex items-center justify-center gap-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
