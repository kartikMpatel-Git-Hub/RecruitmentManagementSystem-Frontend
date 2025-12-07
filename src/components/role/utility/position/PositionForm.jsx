import { Plus, Trash2, Briefcase, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PositionForm({handleSubmit,handleChange,position,handleStatusChange,handleRequirementChange,addRequirement,removeRequirement,handleEducationChange,skills,degrees,addRound,removeRound,handleRoundChange}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/positions')}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Positions
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create Position</h1>
          </div>
          <p className="text-gray-600">Add a new position with requirements and criteria</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
            <h2 className="text-xl font-bold text-white">Position Details</h2>
            <p className="text-slate-200 mt-1">Fill in the position information below</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position Title</label>
                <input
                  type="text"
                  name="positionTitle"
                  value={position.positionTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Enter position title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Openings</label>
                <input
                  type="number"
                  name="positionTotalOpening"
                  min="1"
                  value={position.positionTotalOpening}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Number of openings"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position Type</label>
                <select
                  name="positionType"
                  value={position.positionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="FULLTIME">FULL_TIME</option>
                  <option value="PARTTIME">PART_TIME</option>
                  <option value="INTERNSHIP">INTERNSHIP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                <input
                  type="number"
                  name="positionSalary"
                  value={position.positionSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Enter salary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="positionLocation"
                  value={position.positionLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Enter location"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={position.positionStatus.status}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="ONHOLD">ON_HOLD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Reason</label>
                <input
                  type="text"
                  name="positionStatusReason"
                  value={position.positionStatus.positionStatusReason}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  placeholder="Optional reason"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <input
                type="text"
                name="positionLanguage"
                value={position.positionLanguage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                placeholder="Position Language"
                required
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="positionDescription"
                value={position.positionDescription}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe the position responsibilities and overview"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Criteria</label>
              <textarea
                name="positionCriteria"
                value={position.positionCriteria}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter selection criteria and qualifications"
                required
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Position Rounds</h3>
                <button
                  type="button"
                  onClick={addRound}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Round
                </button>
              </div>

              <div className="space-y-5 mb-6">
                {position.positionRounds.map((round, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Round Type</label>
                        <select
                          name="positionRoundType"
                          value={round.positionRoundType}
                          onChange={(e) => handleRoundChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select Round Type</option>
                          <option value="APTITUDE">APTITUDE</option>
                          <option value="GROUP_DISCUSSION">GROUP DISCUSSION</option>
                          <option value="CODING">CODING</option>
                          <option value="TECHNICAL">TECHNICAL</option>
                          <option value="HR">HR</option>
                          <option value="CEO">CEO</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sequence</label>
                        <input
                          type="number"
                          name="positionRoundSequence"
                          value={round.positionRoundSequence}
                          onChange={(e) => handleRoundChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="Sequence"
                          min="1"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-8"></label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => removeRound(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Required Education</h3>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {degrees.map((degree) => (
                    <label key={degree.degreeId} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={position.positionRequiredEducations.some(edu => edu.degreeId === degree.degreeId)}
                        onChange={(e) => handleEducationChange(degree.degreeId, e.target.checked)}
                        className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{degree.degree}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Position Requirements</h3>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Requirement
                </button>
              </div>

              <div className="space-y-4">
                {position.positionRequirements.map((req, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
                        <select
                          name="skillId"
                          value={req.positionSkill.skillId}
                          onChange={(e) => handleRequirementChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          required
                        >
                          <option value="">Select Skill</option>
                          {skills.map((skill) => (
                            <option key={skill.skillId} value={skill.skillId}>{skill.skill}</option>
                          ))}
                        </select>
                      </div>
                      

                      {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                        <input
                          type="number"
                          name="position"
                          value={req.position}
                          onChange={(e) => handleRequirementChange(index, e)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                          placeholder="Position order"
                          min="1"
                          required
                        />
                      </div> */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Type</label>
                        <div className="flex gap-2">
                          <select
                            name="positionRequirement"
                            value={req.positionRequirement}
                            onChange={(e) => handleRequirementChange(index, e)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="MANDATORY">MANDATORY</option>
                            <option value="PREFERRED">PREFERRED</option>
                            <option value="OPTIONAL">OPTIONAL</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            // disabled={position.positionRequirements.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all font-medium shadow-lg"
              >
                Create Position
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PositionForm
