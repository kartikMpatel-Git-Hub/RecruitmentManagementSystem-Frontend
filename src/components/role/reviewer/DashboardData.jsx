import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight, Calendar, TrendingUp, BarChart3, PieChart, FileText, Clock, CheckCircle, Eye, Star } from "lucide-react";
import Chart from "chart.js/auto";

function DashboardData({ dashboardData }) {
  const navigate = useNavigate();
  const applicationStatusChartRef = useRef(null);
  const applicationsChartRef = useRef(null);
  const applications15DayChartRef = useRef(null);

  const {
    summaryStats = {},
    applicationStatusCounts = [],
    applicationsPerDayLast7Days = [],
    applicationsPerDayLast15Days = [],
    recentApplications = [],
    pendingReviewApplications = [],
    shortlistedApplications = []
  } = dashboardData || {};

  const formatDateArray = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    const [year, month, day] = dateArray;
    return new Date(year, month - 1, day).toLocaleDateString();
  };

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

    if (applicationsChartRef.current && applicationsPerDayLast7Days.length > 0) {
      const ctx = applicationsChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: applicationsPerDayLast7Days.map(item => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [{
            label: 'Applications',
            data: applicationsPerDayLast7Days.map(item => item.count),
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

    if (applications15DayChartRef.current && applicationsPerDayLast15Days.length > 0) {
      const ctx = applications15DayChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: applicationsPerDayLast15Days.map(item => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [{
            label: 'Applications',
            data: applicationsPerDayLast15Days.map(item => item.count),
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
  }, [dashboardData]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Reviewer Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back! Review applications and manage recruitment processes</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
              <p className="text-gray-600 text-sm font-semibold">Reviewed Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.shortlistedApplications || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Star className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.pendingApplications || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Reviewed Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.reviewedToday || 0}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-slate-600" />
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

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 lg:col-span-2">
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
            onClick={() => navigate("/reviewer/applications")}
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
                    application.status === 'MAPPED' ? 'bg-slate-100 text-slate-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{application.candidateName}</h4>
                <p className="text-gray-600 text-sm mb-3">{application.positionTitle}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <span>{application.candidateExperience} years exp.</span>
                  <span>{formatDateArray(application.appliedDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Review Applications</h2>
        </div>
        
        {pendingReviewApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No pending applications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingReviewApplications.map((application) => (
              <div key={application.applicationId} className="bg-orange-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-orange-600 text-sm font-medium">#{application.applicationId}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {application.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{application.candidateName}</h4>
                <p className="text-gray-600 text-sm mb-3">{application.positionTitle}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <span>{application.candidateExperience} years exp.</span>
                  <span>{formatDateArray(application.appliedDate)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-green-600 to-green-700 rounded-xl">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reviewed Applications</h2>
        </div>
        
        {shortlistedApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No Reviewed applications found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedApplications.map((application) => (
              <div key={application.applicationId} className="bg-green-50 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-green-600 text-sm font-medium">#{application.applicationId}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {application.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{application.candidateName}</h4>
                <p className="text-gray-600 text-sm mb-3">{application.positionTitle}</p>
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <span>{application.candidateExperience} years exp.</span>
                  <span>{formatDateArray(application.appliedDate)}</span>
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
