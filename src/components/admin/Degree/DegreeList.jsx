import React from "react";

function DegreeList({ degrees, setEditingDegree, deleteDegree }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Degrees</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        {!degrees || degrees.length === 0 ? (
          <p className="text-gray-600 text-center">No degrees available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {degrees.map((degree) => (
              <div
                key={degree.degreeId}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center text-center"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {degree.degree}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Stream: <span className="font-medium">{degree.stream}</span>
                </p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setEditingDegree(degree)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDegree(degree.degreeId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                  >
                    Delete
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
