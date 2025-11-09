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
  Target
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
              <div className="text-slate-800 font-bold text-xl">{profileData.userName}</div>
            </div>
          </div>
        </div>
 
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Positions</p>
                <p className="text-3xl font-bold text-slate-800">{totalPositions}</p>
                <p className="text-xs text-gray-500 mt-1">All positions</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Open Positions</p>
                <p className="text-3xl font-bold text-green-600">{openPositions}</p>
                <p className="text-xs text-gray-500 mt-1">Currently hiring</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Closed Positions</p>
                <p className="text-3xl font-bold text-red-600">{closedPositions}</p>
                <p className="text-xs text-gray-500 mt-1">No longer hiring</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-slate-700">{totalApplications}</p>
                <p className="text-xs text-gray-500 mt-1">All applications</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-slate-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("positions")}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl hover:from-slate-100 hover:to-slate-200 transition-all duration-300 border border-slate-200 group"
            >
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl group-hover:from-slate-700 group-hover:to-slate-800 transition-all">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">View All Positions</h3>
                <p className="text-sm text-gray-600">Browse and review job positions</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("applications")}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 group"
            >
              <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl group-hover:from-green-700 group-hover:to-green-800 transition-all">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Review Applications</h3>
                <p className="text-sm text-gray-600">Evaluate candidate applications</p>
              </div>
              <ArrowRight className="w-5 h-5 text-green-600 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("applications/shortlists")}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200 group"
            >
              <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl group-hover:from-purple-700 group-hover:to-purple-800 transition-all">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 mb-1">Shortlisted Applications</h3>
                <p className="text-sm text-gray-600">Review shortlisted applications</p>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 ml-auto group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-slate-600" />
              Recent Positions
            </h2>
            <button
              onClick={() => navigate("/reviewer/positions")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {!positions || positions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Positions Available</h3>
              <p className="text-gray-600">There are currently no positions to review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.slice(0, 6).map((position) => (
                <div
                  key={position.positionId}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 group cursor-pointer"
                  onClick={() => navigate(`/reviewer/positions/${position.positionId}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-slate-800 transition-colors">
                        {position.positionTitle}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        {getStatusIcon(position.positionStatus?.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(position.positionStatus?.status)}`}>
                          {position.positionStatus?.status || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-600 text-xs">ID</div>
                      <div className="text-slate-800 font-semibold">#{position.positionId}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-4 h-4" />
                      {position.positionApplications || 0} Applications
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Briefcase className="w-4 h-4" />
                      {position.positionType || "N/A"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reviewer/positions/${position.positionId}/applications`);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all text-sm font-medium shadow-sm"
                    >
                      <Eye className="w-3 h-3" />
                      Applications
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/reviewer/positions/${position.positionId}/applications/shortlist`);
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all text-sm font-medium shadow-sm"
                    >
                      <Star className="w-3 h-3" />
                      Shortlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div> */}
        
      </div>
    </div>
  );
}

export default DashboardData;