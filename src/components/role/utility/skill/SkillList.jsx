import React from "react";
import { Award, Edit3, Trash2 } from "lucide-react";

function SkillList({ skills, setEditingSkill, deleteSkill }) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Award className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Manage Skills</h1>
        </div>
        <p className="text-gray-600">Add, edit, and manage skill categories</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {!skills || skills.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No skills available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.skillId}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2">
                  {skill.skill}
                </h3>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => setEditingSkill(skill)}
                    className="flex items-center justify-center flex-1 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.skillId)}
                    className="flex items-center justify-center px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
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
