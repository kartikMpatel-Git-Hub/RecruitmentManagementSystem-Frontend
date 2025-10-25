import React from "react";
import { Building2, Edit3, Trash2 } from "lucide-react";

function UniversityList({ universities, setEditingUniversity, deleteUniversity }) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Building2 className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Universities</h1>
        </div>
        <p className="text-gray-600">Add, edit, and manage university listings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {!universities || universities.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No universities available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((university) => (
              <div
                key={university.universityId}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center line-clamp-2">
                  {university.university}
                </h3>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setEditingUniversity(university)}
                    className="flex items-center justify-center flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteUniversity(university.universityId)}
                    className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default UniversityList;
