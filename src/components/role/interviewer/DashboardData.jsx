import { useNavigate } from "react-router-dom";
import { 
  Users, 
  ArrowRight, 
  Briefcase, 
  Eye, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Pause,
  BarChart3,
  FileText,
  Target,
  MessageSquare
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function DashboardData({ interviews }) {
  const navigate = useNavigate();
  const {profileData} = useContext(AuthContext)

  const totalInterviews = interviews?.length || 0;
  const pendingInterviews = interviews?.filter(i => i.interviewStatus?.toLowerCase() === "scheduled").length || 0;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "scheduled":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isInterviewCompleted = (interview) => {
    if (interview.interviewStatus?.toLowerCase() === "completed") return true;
    
    const now = new Date();
    const interviewDate = Array.isArray(interview.localDate) 
      ? new Date(interview.localDate[0], interview.localDate[1] - 1, interview.localDate[2])
      : new Date(interview.localDate);
    
    const interviewTime = Array.isArray(interview.interviewTime)
      ? new Date(interviewDate.getFullYear(), interviewDate.getMonth(), interviewDate.getDate(), interview.interviewTime[0], interview.interviewTime[1])
      : new Date(`${interviewDate.toDateString()} ${interview.interviewTime}`);
    
    return now > interviewTime;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Interviewer Dashboard</h1>
                <p className="text-gray-600 text-lg">Review interviews and manage recruitment processes</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-600 text-sm">Welcome back</div>
              <div className="text-slate-800 font-bold text-xl">{profileData?.userName}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-slate-800">{totalInterviews}</p>
                <p className="text-xs text-gray-500 mt-1">All interviews assigned</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Scheduled Interviews</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingInterviews}</p>
                <p className="text-xs text-gray-500 mt-1">Upcoming interviews</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Completed Interviews</p>
                <p className="text-3xl font-bold text-green-600">{interviews?.filter(i => i.interviewStatus?.toLowerCase() === "completed").length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Finished interviews</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-slate-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/interviewer/interviews")}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 border border-slate-200 group"
            >
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl group-hover:from-slate-700 group-hover:to-slate-800 transition-all">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">View My Interviews</h3>
                <p className="text-sm text-gray-600">Review and manage your assigned interviews</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/interviewer/profile")}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 group"
            >
              <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl group-hover:from-purple-700 group-hover:to-purple-800 transition-all">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">My Profile</h3>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-6 h-6 text-slate-600" />
              Recent Interviews
            </h2>
            <button
              onClick={() => navigate("/interviewer/interviews")}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {interviews && interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview) => (
                <div
                  key={interview.interviewId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-xl">
                      {getStatusIcon(interview.interviewStatus)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Interview #{interview.interviewId}</h3>
                      <p className="text-sm text-gray-600">
                        {Array.isArray(interview.localDate)
                          ? `${String(interview.localDate[2]).padStart(2, '0')}/${String(interview.localDate[1]).padStart(2, '0')}/${interview.localDate[0]}`
                          : interview.localDate || "Date not set"}
                        {" at "}
                        {Array.isArray(interview.interviewTime)
                          ? `${String(interview.interviewTime[0]).padStart(2, '0')}:${String(interview.interviewTime[1]).padStart(2, '0')}`
                          : interview.interviewTime || "Time not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(interview.interviewStatus)}`}>
                      {interview.interviewStatus}
                    </span>
                    <button
                      onClick={() => navigate(`/interviewer/interview/${interview.interviewId}/details`)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-3 h-3 inline mr-1" />
                      Details
                    </button>
                    {isInterviewCompleted(interview) && (
                      <button
                        onClick={() => navigate(`/interviewer/interview/${interview.interviewId}/feedback`)}
                        className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        Feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h3>
              <p className="text-gray-600">You don't have any interviews assigned yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardData;