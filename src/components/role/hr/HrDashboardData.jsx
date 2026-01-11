import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Award,
  Building2,
  ArrowRight,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
} from "lucide-react";
import Chart from "chart.js/auto";
import { formatDateArray, formatTimeArray } from "../../utility/dateTimeUtils";

function HrDashboardData({ dashboardData }) {
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
    monthlyHiringStats = [],
  } = dashboardData || {};

  useEffect(() => {
    // Application Status Chart
    if (
      applicationStatusChartRef.current &&
      applicationStatusCounts.length > 0
    ) {
      const ctx = applicationStatusChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: applicationStatusCounts.map((item) => item.applicationStatus),
          datasets: [
            {
              data: applicationStatusCounts.map((item) => item.count),
              backgroundColor: [
                "#1e293b",
                "#475569",
                "#64748b",
                "#94a3b8",
                "#cbd5e1",
                "#e2e8f0",
                "#f1f5f9",
              ],
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

    // Applications Chart (7 days)
    if (
      applicationsChartRef.current &&
      applicationsPerDayLast7Days.length > 0
    ) {
      const ctx = applicationsChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: applicationsPerDayLast7Days.map((item) => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [
            {
              label: "Applications",
              data: applicationsPerDayLast7Days.map((item) => item.count),
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

    // Applications Chart (15 days)
    if (
      applications15DayChartRef.current &&
      applicationsPerDayLast15Days.length > 0
    ) {
      const ctx = applications15DayChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: applicationsPerDayLast15Days.map((item) => {
            const [year, month, day] = item.date;
            return `${day}/${month}`;
          }),
          datasets: [
            {
              label: "Applications",
              data: applicationsPerDayLast15Days.map((item) => item.count),
              borderColor: "#475569",
              backgroundColor: "rgba(71, 85, 105, 0.1)",
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

    // Top Skills Chart
    if (skillsChartRef.current && topSkills.length > 0) {
      const ctx = skillsChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: topSkills.map((item) => item.skill),
          datasets: [
            {
              label: "Count",
              data: topSkills.map((item) => item.count),
              backgroundColor: "#1e293b",
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

    // Experience Distribution Chart
    if (
      experienceChartRef.current &&
      Object.keys(experienceDistribution).length > 0
    ) {
      const ctx = experienceChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["< 1 Year", "1-3 Years", "3-5 Years", "> 5 Years"],
          datasets: [
            {
              data: [
                experienceDistribution.lessThanOneYear || 0,
                experienceDistribution.oneToThreeYears || 0,
                experienceDistribution.threeToFiveYears || 0,
                experienceDistribution.moreThanFiveYears || 0,
              ],
              backgroundColor: ["#1e293b", "#475569", "#64748b", "#94a3b8"],
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

    // Interview Outcome Chart
    if (interviewOutcomeChartRef.current && interviewOutcomeStats.length > 0) {
      const ctx = interviewOutcomeChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: interviewOutcomeStats.map((item) => item.outcome),
          datasets: [
            {
              label: "Count",
              data: interviewOutcomeStats.map((item) => item.count),
              backgroundColor: ["#1e293b", "#475569", "#64748b"],
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

    // Recruitment Funnel Chart
    if (
      funnelChartRef.current &&
      Object.keys(recruitmentFunnelStat).length > 0
    ) {
      const ctx = funnelChartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Applications", "Shortlisted", "Selected"],
          datasets: [
            {
              label: "Count",
              data: [
                recruitmentFunnelStat.applications || 0,
                recruitmentFunnelStat.shortlisted || 0,
                recruitmentFunnelStat.selected || 0,
              ],
              backgroundColor: ["#1e293b", "#475569", "#64748b"],
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
  }, [dashboardData]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                HR Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back! Manage your recruitment process and candidates
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Total Candidates
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.totalCandidates || 0}
              </p>
              <p className="text-green-600 text-xs mt-1">
                +{summaryStats.newCandidatesToday || 0} today
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Total Applications
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.totalApplications || 0}
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
              <p className="text-gray-600 text-sm font-semibold">
                Open Positions
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.totalOpenPositions || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-slate-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">
                Upcoming Interviews
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {summaryStats.upcomingInterviewsCount || 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-slate-600" />
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
            <h3 className="text-xl font-bold text-gray-900">
              Application Status
            </h3>
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
            <h3 className="text-xl font-bold text-gray-900">
              Applications (Last 7 Days)
            </h3>
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
            <h3 className="text-xl font-bold text-gray-900">Top Skills</h3>
          </div>
          <div className="h-64">
            <canvas ref={skillsChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Experience Distribution
            </h3>
          </div>
          <div className="h-64">
            <canvas ref={experienceChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Interview Outcomes
            </h3>
          </div>
          <div className="h-64">
            <canvas ref={interviewOutcomeChartRef}></canvas>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Recruitment Funnel
            </h3>
          </div>
          <div className="h-64">
            <canvas ref={funnelChartRef}></canvas>
          </div>
        </div>
      </div>
      {upcomingInterviews && upcomingInterviews.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white-900">
              Upcoming Interviews
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingInterviews.map((interview) => (
              <div
                key={interview.interviewId}
                className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                    <span className="text-slate-700 font-semibold text-sm">
                      Interview #{interview.interviewId}
                    </span>
                  </div>
                  <Clock className="w-4 h-4 text-slate-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {interview.candidateName}
                </h4>
                <p className="text-gray-600 text-sm mb-2">
                  Interviewer: {interview.interviewerName}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDateArray(interview.interviewDate)} at{" "}
                    {formatTimeArray(interview.interviewTime)}
                  </span>
                </div>
                {interview.meetingLink && (
                  <button
                    onClick={() => window.open(interview.meetingLink, "_blank")}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
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
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Candidates
            </h2>
          </div>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg"
            onClick={() => navigate("/hr/candidates")}
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
            <p className="text-gray-500 text-lg">No recent candidates found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCandidates.slice(0, 6).map((candidate) => (
              <div
                key={candidate.candidateId}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {candidate.candidateName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {candidate.candidateEmail}
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-gray-600 text-sm mb-1">
                    Experience: {candidate.experienceYears} years
                  </p>
                  <p className="text-gray-600 text-sm">
                    Phone: {candidate.candidatePhoneNumber}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {candidate.primarySkills?.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                  {candidate.primarySkills?.length > 3 && (
                    <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-lg">
                      +{candidate.primarySkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Top Candidates by Experience
            </h3>
          </div>
          <div className="space-y-3">
            {topCandidatesByExperience.slice(0, 5).map((candidate) => (
              <div
                key={candidate.candidateId}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {candidate.name}
                  </p>
                  <p className="text-gray-600 text-sm">{candidate.email}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.primarySkills
                      ?.slice(0, 2)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">
                    {candidate.experienceYears} years
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Position Analytics
            </h3>
          </div>
          <div className="space-y-3">
            {positionAnalytics.map((position) => (
              <div
                key={position.positionId}
                className="p-4 bg-slate-50 rounded-xl border border-slate-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {position.title}
                  </h4>
                  <span className="text-slate-600 text-sm">
                    ID: {position.positionId}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Applications</p>
                    <p className="font-bold text-slate-800">
                      {position.totalApplications}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Shortlisted</p>
                    <p className="font-bold text-slate-800">
                      {position.shortlisted}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Selected</p>
                    <p className="font-bold text-slate-800">
                      {position.selected}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {applicationsPerDayLast15Days &&
        applicationsPerDayLast15Days.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 mb-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Applications Trend (Last 15 Days)
              </h3>
            </div>
            <div className="h-64">
              <canvas ref={applications15DayChartRef}></canvas>
            </div>
          </div>
        )}
      {monthlyHiringStats && monthlyHiringStats.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Monthly Hiring Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyHiringStats.map((stat, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200"
              >
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">
                    Month {index + 1}
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stat.count || 0}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Hires</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Top Degrees</h3>
          </div>
          <div className="space-y-3">
            {topDegrees.map((degree, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <p className="font-medium text-gray-900 text-sm">
                  {degree.degree}
                </p>
                <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-semibold">
                  {degree.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Top Universities
            </h3>
          </div>
          <div className="space-y-3">
            {topUniversities.map((university, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                <p className="font-medium text-gray-900 text-sm">
                  {university.university}
                </p>
                <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-semibold">
                  {university.count}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">System Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-gray-600 text-sm">Total Skills</span>
              <span className="font-bold text-slate-800">
                {summaryStats.totalSkills || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-gray-600 text-sm">Total Degrees</span>
              <span className="font-bold text-slate-800">
                {summaryStats.totalDegrees || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <span className="text-gray-600 text-sm">Universities</span>
              <span className="font-bold text-slate-800">
                {summaryStats.totalUniversities || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HrDashboardData;
