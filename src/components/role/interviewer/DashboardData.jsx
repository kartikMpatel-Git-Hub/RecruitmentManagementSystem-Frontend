import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  Video,
  FileText,
  MessageSquare,
  AlertCircle,
  PieChart,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import Chart from "chart.js/auto";
import { AuthContext } from "../../context/AuthContext";

function DashboardData({ dashboardData }) {
  const navigate = useNavigate();
  const { profileData } = useContext(AuthContext);

  const {
    summaryStats = {},
    interviewsPerNext7Days = [],
    interviewsPerPrevious7Days = [],
    interviewStatusCounts = [],
    feedbackStatus = {},
    todaysInterviews = [],
    upcomingInterviews = [],
    pendingFeedbackInterviews = [],
    completedInterviews = [],
  } = dashboardData || {};

  const formatDateArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "N/A";
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

  const formatTimeArray = (timeArray) => {
    if (!timeArray || timeArray.length < 2) return "N/A";
    const [hour, minute] = timeArray;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Interviewer Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Manage your interviews and provide feedback
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Total Assigned
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.totalAssignedInterviews || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.upcomingInterviews || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Today's Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.interviewsToday || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.completedInterviews || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Pending Feedback
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.pendingFeedbackCount || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <InterviewStatusChart interviewStatusCounts={interviewStatusCounts} />
        <InterviewTrendChart
          interviewsPerNext7Days={interviewsPerNext7Days}
          interviewsPerPrevious7Days={interviewsPerPrevious7Days}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <FeedbackStatusChart feedbackStatus={feedbackStatus} />
      </div>
      {todaysInterviews && todaysInterviews.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Today's Interviews
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {todaysInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 font-semibold text-sm">
                      Interview #{interview.interviewId}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                    {interview.interviewType}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {interview.candidateName}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  {interview.positionTitle}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeArray(interview.interviewTime)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Interviews
            </h2>
          </div>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            onClick={() => navigate("/interviewer/interviews")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {upcomingInterviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">
              No upcoming interviews scheduled.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 text-sm">
                    #{interview.interviewId}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {interview.interviewType}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {interview.candidateName}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {interview.positionTitle}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-5">
                  <span>{formatDateArray(interview.interviewDate)}</span>
                  <span>{formatTimeArray(interview.interviewTime)}</span>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `./interviews/${interview.interviewId}/details`
                    )
                  }
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Feedback</h2>
        </div>

        {pendingFeedbackInterviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No pending feedback found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingFeedbackInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 text-sm font-medium">
                    #{interview.interviewId}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {interview.interviewType}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {interview.candidateName}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {interview.positionTitle}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
                  <span>{formatDateArray(interview.interviewDate)}</span>
                  <span>{formatTimeArray(interview.interviewTime)}</span>
                </div>
                <button
                  onClick={() =>
                    navigate(
                      `./${profileData.userId}/interviews/${interview.interviewId}/feedback`
                    )
                  }
                  className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                  Submit Feedback
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Completed Interviews
          </h2>
        </div>

        {completedInterviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">
              No completed interviews found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 text-sm font-medium">
                    #{interview.interviewId}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {interview.interviewType}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {interview.candidateName}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {interview.positionTitle}
                </p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <span>{formatDateArray(interview.interviewDate)}</span>
                  <span>{formatTimeArray(interview.interviewTime)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InterviewStatusChart({ interviewStatusCounts }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && interviewStatusCounts.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: interviewStatusCounts.map((item) => item.interviewStatus),
          datasets: [
            {
              data: interviewStatusCounts.map((item) => item.count),
              backgroundColor: ["#1e293b", "#475569", "#64748b"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20, usePointStyle: true },
            },
          },
        },
      });
    }
  }, [interviewStatusCounts]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
          <PieChart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Interview Status Distribution
        </h3>
      </div>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

function InterviewTrendChart({
  interviewsPerNext7Days,
  interviewsPerPrevious7Days,
}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const formatDate = (dateArray) => {
        const [year, month, day] = dateArray;
        return `${day}/${month}`;
      };

      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: [
            ...interviewsPerPrevious7Days.map((item) => formatDate(item.date)),
            ...interviewsPerNext7Days.map((item) => formatDate(item.date)),
          ],
          datasets: [
            {
              label: "Interviews",
              data: [
                ...interviewsPerPrevious7Days.map(
                  (item) => item.interviewCount
                ),
                ...interviewsPerNext7Days.map((item) => item.interviewCount),
              ],
              borderColor: "#1e293b",
              backgroundColor: "rgba(30, 41, 59, 0.1)",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  }, [interviewsPerNext7Days, interviewsPerPrevious7Days]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Interview Trend (14 Days)
        </h3>
      </div>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
function FeedbackStatusChart({ feedbackStatus }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && feedbackStatus) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Feedback Given", "Feedback Pending"],
          datasets: [
            {
              data: [
                feedbackStatus.feedbackGiven || 0,
                feedbackStatus.feedbackPending || 0,
              ],
              backgroundColor: ["#475569", "#64748b"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 20, usePointStyle: true },
            },
          },
        },
      });
    }
  }, [feedbackStatus]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Feedback Status</h3>
      </div>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default DashboardData;
