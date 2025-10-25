import React from "react";
import { GraduationCap, Edit3, Trash2 } from "lucide-react";

function DegreeList({ degrees, setEditingDegree, deleteDegree }) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <GraduationCap className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Degrees</h1>
        </div>
        <p className="text-gray-600">Add, edit, and manage degree programs</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {!degrees || degrees.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No degrees available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {degrees.map((degree) => (
              <div
                key={degree.degreeId}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {degree.degree}
                </h3>

                <div className="bg-white px-3 py-1 rounded-full mb-4">
                  <p className="text-sm text-green-700 font-medium">
                    {degree.stream}
                  </p>
                </div>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setEditingDegree(degree)}
                    className="flex items-center justify-center flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteDegree(degree.degreeId)}
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

export default DegreeList;
