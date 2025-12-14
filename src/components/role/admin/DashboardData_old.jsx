import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, Award, Building2, ArrowRight, Calendar, TrendingUp, BarChart3, PieChart, FileText, Clock, CheckCircle, XCircle, AlertCircle, Video } from "lucide-react";
import Chart from "chart.js/auto";
import { formatDateArray, formatTimeArray } from "../../utility/dateTimeUtils";

function DashboardData({ dashboardData }) {
  const navigate = useNavigate();
  const applicationStatusChartRef = useRef(null);
  const applicationsChartRef = useRef(null);
  const applications15DayChartRef = useRef(null);
  const skillsChartRef = useRef(null);
  const experienceChartRef = useRef(null);
  const interviewOutcomeChartRef = useRef(null);
  const funnelChartRef = useRef(null);

  const {
    summaryStats = {},
    applicationStatusCounts = [],
    recentCandidates = [],
    upcomingInterviews = [],
    applicationsPerDayLast7Days = [],
    applicationsPerDayLast15Days = [],
    topSkills = [],
    topDegrees = [],
    topUniversities = [],
    experienceDistribution = {},
    interviewOutcomeStats = [],
    topCandidatesByExperience = [],
    recruitmentFunnelStat = {},
    positionAnalytics = [],
    monthlyHiringStats = []
  } = dashboardData || {};

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back! Manage your system resources and users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalUsers}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalCandidates}</p>
              <p className="text-xs text-green-600 mt-1">+{summaryStats.newCandidatesToday} today</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalApplications}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Open Positions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalOpenPositions}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Upcoming Interviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.upcomingInterviewsCount}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalSkills}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center">
              <Award className="w-7 h-7 text-teal-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Universities</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalUniversities}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-shadow-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Total Degrees</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{summaryStats.totalDegrees}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Application Status</h3>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: applicationStatusCounts.map(status => status.applicationStatus),
                datasets: [{
                  label: 'Applications',
                  data: applicationStatusCounts.map(status => status.count),
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                  ],
                  borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(168, 85, 247, 1)',
                  ],
                  borderWidth: 2,
                  borderRadius: 8,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#6B7280' }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280' }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Top Skills</h3>
          </div>
          <div className="h-64">
            <Bar
              data={{
                labels: topSkills.slice(0, 5).map(skill => skill.skill),
                datasets: [{
                  label: 'Candidates',
                  data: topSkills.slice(0, 5).map(skill => skill.count),
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgba(59, 130, 246, 1)',
                  borderWidth: 2,
                  borderRadius: 8,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#6B7280' }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { color: '#6B7280' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-slate-600" />
          <h3 className="text-xl font-bold text-gray-900">Experience Distribution</h3>
        </div>
        <div className="h-64">
          <Bar
            data={{
              labels: ['< 1 Year', '1-3 Years', '3-5 Years', '5+ Years'],
              datasets: [{
                label: 'Candidates',
                data: [
                  experienceDistribution.lessThanOneYear,
                  experienceDistribution.oneToThreeYears,
                  experienceDistribution.threeToFiveYears,
                  experienceDistribution.moreThanFiveYears
                ],
                backgroundColor: [
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(168, 85, 247, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                  'rgba(34, 197, 94, 1)',
                  'rgba(59, 130, 246, 1)',
                  'rgba(168, 85, 247, 1)',
                  'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0, 0, 0, 0.1)' },
                  ticks: { color: '#6B7280' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#6B7280' }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Applications Timeline */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-slate-600" />
          <h3 className="text-xl font-bold text-gray-900">Applications Last 7 Days</h3>
        </div>
        <div className="h-64">
          <Line
            data={{
              labels: applicationsPerDayLast7Days.map(day => {
                const date = new Date(day.date[0], day.date[1] - 1, day.date[2]);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }),
              datasets: [{
                label: 'Applications',
                data: applicationsPerDayLast7Days.map(day => day.count),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
                pointRadius: 6,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0, 0, 0, 0.1)' },
                  ticks: { color: '#6B7280' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#6B7280' }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Degrees and Universities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Top Degrees</h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={{
                labels: topDegrees.map(degree => degree.degree.split(' ').slice(0, 3).join(' ')),
                datasets: [{
                  data: topDegrees.map(degree => degree.count),
                  backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                  ],
                  borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(245, 158, 11, 1)',
                  ],
                  borderWidth: 2,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#6B7280', padding: 20 }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Top Universities</h3>
          </div>
          <div className="h-64">
            <Doughnut
              data={{
                labels: topUniversities.map(university => university.university.split(' ').slice(0, 3).join(' ')),
                datasets: [{
                  data: topUniversities.map(university => university.count),
                  backgroundColor: [
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                  ],
                  borderColor: [
                    'rgba(168, 85, 247, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                  ],
                  borderWidth: 2,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: '#6B7280', padding: 20 }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Interview Outcomes */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-slate-600" />
          <h3 className="text-xl font-bold text-gray-900">Interview Outcomes</h3>
        </div>
        <div className="h-64">
          <Bar
            data={{
              labels: interviewOutcomeStats.map(outcome => outcome.outcome),
              datasets: [{
                label: 'Interviews',
                data: interviewOutcomeStats.map(outcome => outcome.count),
                backgroundColor: [
                  'rgba(34, 197, 94, 0.8)',
                  'rgba(239, 68, 68, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                ],
                borderColor: [
                  'rgba(34, 197, 94, 1)',
                  'rgba(239, 68, 68, 1)',
                  'rgba(59, 130, 246, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: 'rgba(0, 0, 0, 0.1)' },
                  ticks: { color: '#6B7280' }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#6B7280' }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Upcoming Interviews</h3>
          </div>
        </div>
        {dashboardData.upcomingInterviews.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No upcoming interviews scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.upcomingInterviews.map((interview) => (
              <div key={interview.interviewId} className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Interview #{interview.interviewId}</h4>
                    <p className="text-sm text-gray-600">Candidate: {interview.candidateName}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interviewer:</span>
                    <span className="font-medium text-gray-900">{interview.interviewerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(interview.interviewDate[0], interview.interviewDate[1] - 1, interview.interviewDate[2]).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium text-gray-900">
                      {String(interview.interviewTime[0]).padStart(2, '0')}:{String(interview.interviewTime[1]).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {/* <button 
                  onClick={() => window.open(interview.meetingLink, '_blank')}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Join Meeting
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Candidates by Experience */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-slate-600" />
            <h3 className="text-xl font-bold text-gray-900">Top Candidates by Experience</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topCandidatesByExperience.map((candidate) => (
                <tr key={candidate.candidateId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {candidate.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {candidate.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {candidate.experienceYears} years
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.primarySkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {candidate.primarySkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{candidate.primarySkills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Candidates</h2>
          </div>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            onClick={() => navigate("/admin/candidates")}
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {recentCandidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-gray-500 text-lg">No candidates found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentCandidates.slice(0, 5).map((candidate) => (
                  <tr key={candidate.candidateId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {candidate.candidateName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {candidate.candidateEmail}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.primarySkills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {candidate.primarySkills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{candidate.primarySkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {candidate.experienceYears ? `${candidate.experienceYears} years` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardData;