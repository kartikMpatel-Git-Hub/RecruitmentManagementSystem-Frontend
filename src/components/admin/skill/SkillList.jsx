import React from "react";

function SkillList({ skills, setEditingSkill, deleteSkill }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Skills</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        {!skills || skills.length === 0 ? (
          <p className="text-gray-600 text-center">No skills available.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-6">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className="bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow flex flex-col items-center text-center"
              >
                <h3 className="text-lg font-bold text-gray-800">
                  {skill.skill}
                </h3>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.skillId)}
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

export default SkillList;
