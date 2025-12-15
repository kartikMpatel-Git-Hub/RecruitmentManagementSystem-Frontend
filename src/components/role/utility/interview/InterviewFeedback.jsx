import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { MessageSquare, Star, Save, ArrowLeft } from "lucide-react";
import InterviewerLayout from "../../interviewer/InterviewerLayout";

function InterviewFeedback() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { interviewId, interviewerId } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [overallFeedback, setOverallFeedback] = useState("");
  const [skillRatings, setSkillRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFeedback = async () => {
    if (!authToken) 
      navigate("/");
    try {
      const response = await axios.get(
        `http://localhost:8080/interviews/${interviewId}/feedback/${interviewerId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = response.data;

      setFeedbackData(data);
      setOverallFeedback(data.interviewFeedback || "");
      setSkillRatings(data.skillRatings || []);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const updateSkillRating = (index, field, value) => {
    const updated = [...skillRatings];
    updated[index] = { ...updated[index], [field]: value };
    setSkillRatings(updated);
  };

  const handleSubmit = async (interviewFeedbackId) => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8080/interviews/${interviewId}/feedbacks/${interviewFeedbackId}`,
        {
          interviewFeedback: overallFeedback,
          skillRatings: skillRatings
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      navigate(-1);
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if(!authToken)
      navigate("/")
    fetchFeedback();
  }, []);

  if (!feedbackData) {
    return (
      <InterviewerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading feedback...</div>
        </div>
      </InterviewerLayout>
    );
  }

  return (
    <InterviewerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Interview Feedback
              </h1>
              <p className="text-sm text-gray-600">
                Interview #{interviewId} - Provide your feedback
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Skill Ratings
          </h2>
          <div className="space-y-6">
            {skillRatings.map((skillRating, index) => (
              <div key={skillRating.skillRatingId} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">
                    {skillRating.skill?.skill}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateSkillRating(index, 'skillRating', star)}
                          className={`p-1 ${
                            star <= skillRating.skillRating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          <Star className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {skillRating.skillRating}/5
                    </span>
                  </div>
                </div>
                <textarea
                  placeholder="Add feedback for this skill..."
                  value={skillRating.skillFeedback || ""}
                  onChange={(e) => updateSkillRating(index, 'skillFeedback', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Interview Feedback
          </h2>
          <textarea
            placeholder="Provide your overall feedback about the candidate's performance..."
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={6}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={()=>handleSubmit(feedbackData.interviewFeedbackId)}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Feedback'}
          </button>
        </div>
      </div>
    </InterviewerLayout>
  );
}

export default InterviewFeedback;
