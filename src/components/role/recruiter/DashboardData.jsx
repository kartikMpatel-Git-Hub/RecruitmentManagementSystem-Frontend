import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Award, Building2, ArrowRight, Calendar, TrendingUp, BarChart3, PieChart, FileText, Clock, CheckCircle, XCircle, AlertCircle, Video, Briefcase } from "lucide-react";
import Chart from "chart.js/auto";
import { formatDateArray, formatTimeArray } from "../../utility/dateTimeUtils";

function DashboardData({ dashboardData }) {
  const navigate = useNavigate();
  const applicationStatusChartRef = useRef(null);
  const applicationsChartRef = useRef(null);
  const applications15DayChartRef = useRef(null);
  const performanceChartRef = useRef(null);

  const {
    summaryStats = {},
    positionsOverview = [],
    applicationStatusCounts = [],
    applicationsLast7Days = [],
    applicationsLast15Days = [],
    recentApplications = [],
    upcomingInterviews = [],
    positionPerformance = []
  } = dashboardData || {};

  useEffect(() => {
    if (applicationStatusChartRef.current && applicationStatusCounts.length > 0) {
      const ctx = applicationStatusChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: applicationStatusCounts.map(item => item.applicationStatus),
          datasets: [{
            data: applicationStatusCounts.map(item => item.count),
            backgroundColor: ['#1e293b', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { padding: 20, usePointStyle: true }
            }
          }
        }
      });
    }

    if (applicationsChartRef.current && applicationsLast7Days.length > 0) {
      const ctx = applicationsChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: applicationsLast7Days.map(item => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [{
            label: 'Applications',
            data: applicationsLast7Days.map(item => item.count),
            borderColor: '#1e293b',
            backgroundColor: 'rgba(30, 41, 59, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    if (applications15DayChartRef.current && applicationsLast15Days.length > 0) {
      const ctx = applications15DayChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: applicationsLast15Days.map(item => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [{
            label: 'Applications',
            data: applicationsLast15Days.map(item => item.count),
            borderColor: '#475569',
            backgroundColor: 'rgba(71, 85, 105, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    if (performanceChartRef.current && positionPerformance.length > 0) {
      const ctx = performanceChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: positionPerformance.map(item => item.positionTitle),
          datasets: [{
            label: 'Shortlist Rate (%)',
            data: positionPerformance.map(item => item.shortlistRate),
            backgroundColor: '#1e293b'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }
      });
    }
  }, [dashboardData]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back! Manage your recruitment process and positions</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Positions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalPositions || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Active Positions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.activePositions || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalApplications || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Interviews Scheduled</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.interviewsScheduled || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Candidates Selected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.candidatesSelected || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Application Status</h3>
          </div>
          <div className="h-64">
            <canvas ref={applicationStatusChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Applications (Last 7 Days)</h3>
          </div>
          <div className="h-64">
            <canvas ref={applicationsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Position Performance</h3>
          </div>
          <div className="h-64">
            <canvas ref={performanceChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Applications Trend (Last 15 Days)</h3>
          </div>
          <div className="h-64">
            <canvas ref={applications15DayChartRef}></canvas>
          </div>
        </div>
      </div>
      {upcomingInterviews && upcomingInterviews.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Interviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.map((interview) => (
              <div key={interview.interviewId} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 font-semibold text-sm">Interview #{interview.interviewId}</span>
                  </div>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{interview.candidateName}</h4>
                <p className="text-gray-600 text-sm mb-2">Interviewer: {interview.interviewerName}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateArray(interview.interviewDate)} at {formatTimeArray(interview.interviewTime)}</span>
                </div>
                {interview.meetingLink && (
                  <button
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Meeting</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Applications</h2>
          </div>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            onClick={() => navigate("/recruiter/applications")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No recent applications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentApplications.map((application) => (
              <div key={application.applicationId} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600 text-sm">#{application.applicationId}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    application.status === 'SHORTLISTED' ? 'bg-green-100 text-green-800' :
                    application.status === 'UNDERPROCESS' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{application.candidateName}</h4>
                <p className="text-gray-600 text-sm mb-3">{application.positionTitle}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDateArray(application.appliedDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Positions Overview</h2>
        </div>
        
        {positionsOverview.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No positions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {positionsOverview.map((position) => (
              <div key={position.positionId} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{position.title}</h4>
                    <p className="text-gray-600 text-sm">Position ID: {position.positionId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    position.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {position.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Applications</p>
                    <p className="font-bold text-slate-800 text-lg">{position.applications}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shortlisted</p>
                    <p className="font-bold text-slate-800 text-lg">{position.shortlisted}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Selected</p>
                    <p className="font-bold text-slate-800 text-lg">{position.selected}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rejected</p>
                    <p className="font-bold text-slate-800 text-lg">{position.rejected}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Position Performance Details</h2>
        </div>
        
        {positionPerformance.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No performance data available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {positionPerformance.map((position) => (
              <div key={position.positionId} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 text-lg">{position.positionTitle}</h4>
                  <span className="text-slate-600 text-sm">ID: {position.positionId}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Applications</p>
                    <p className="font-bold text-slate-800 text-lg">{position.applications}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shortlist Rate</p>
                    <p className="font-bold text-slate-800 text-lg">{position.shortlistRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mapped Rate</p>
                    <p className="font-bold text-slate-800 text-lg">{position.mappedRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Selection Rate</p>
                    <p className="font-bold text-slate-800 text-lg">{position.selectionRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rejection Rate</p>
                    <p className="font-bold text-slate-800 text-lg">{position.rejectionRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardData;
