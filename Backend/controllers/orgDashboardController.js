// controllers/dashboardController.js
import { Advertisement } from "../models/advertisementModel.js";
import { Application } from "../models/applicationModel.js";
import { ScheduledInterview } from "../models/interviewModel.js";
import { InterviewPipeline } from "../models/interviewPipelineModel.js";
import { Candidate } from "../models/candidateModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { OfferLetter } from "../models/candidateOfferLetterModal.js";
import mongoose from "mongoose";

// ============================================
// MAIN DASHBOARD CONTROLLER
// ============================================
export const getDashboardData = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    // Fetch all data in parallel for performance
    const [
      kpiData,
      applicationsTrend,
      performanceData,
      jobDistribution,
      recentApplications,
      offerLetterStats,
      todayInterviews,
      upcomingInterviews
    ] = await Promise.all([
      getKPIData(organizationId),
      getApplicationsTrend(organizationId),
      getPerformanceData(organizationId),
      getJobDistribution(organizationId),
      getRecentApplications(organizationId),
      getOfferLetterStats(organizationId),
      getTodayInterviews(organizationId),
      getUpcomingInterviews(organizationId)
    ]);

    res.status(200).json({
      success: true,
      data: {
        kpiCards: kpiData,
        applicationsTrend,
        performanceData,
        jobDistribution,
        recentApplications,
        offerLetterStats,
        todayInterviews,
        upcomingInterviews
      }
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data"
    });
  }
};

// ============================================
// KPI CARDS DATA
// ============================================
const getKPIData = async (organizationId) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const previousThirtyDays = new Date(thirtyDaysAgo - 30 * 24 * 60 * 60 * 1000);

 const [
    activeJobs,
    previousActiveJobs,
    totalApplications,
    previousApplications,
    ongoingInterviews,
    previousOngoingInterviews,
    finalHires,
    previousHires,
    offerLettersSent,
    previousOffers
  ] = await Promise.all([
    Advertisement.countDocuments({ organizationId, status: "Live" }),
    Advertisement.countDocuments({ organizationId, status: "Live", createdAt: { $lte: thirtyDaysAgo } }),
    Application.countDocuments({ organizationId, createdAt: { $gte: thirtyDaysAgo } }),
    Application.countDocuments({ organizationId, createdAt: { $gte: previousThirtyDays, $lt: thirtyDaysAgo } }),
    // ScheduledInterview.countDocuments({ status: { $in: ["Scheduled", "Ongoing"] } }),
    // ScheduledInterview.countDocuments({ status: { $in: ["Scheduled", "Ongoing"] }, createdAt: { $lt: thirtyDaysAgo } }),
    ScheduledInterview.countDocuments({
  status: "Ongoing"
}),

ScheduledInterview.countDocuments({
  status: "Ongoing",
  createdAt: { $lt: thirtyDaysAgo }
}),
    Application.countDocuments({ 
      organizationId, 
      status: { $in: ["Hired", "Offered"] }, // Count both Hired and Offered
      createdAt: { $gte: thirtyDaysAgo } 
    }),
    Application.countDocuments({ 
      organizationId, 
      status: { $in: ["Hired", "Offered"] },
      createdAt: { $gte: previousThirtyDays, $lt: thirtyDaysAgo } 
    }),
    Application.countDocuments({ organizationId, status: "Offered", createdAt: { $gte: thirtyDaysAgo } }),
    Application.countDocuments({ organizationId, status: "Offered", createdAt: { $gte: previousThirtyDays, $lt: thirtyDaysAgo } })
  ]);

  const calcPercentage = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return [
    {
      title: "Active Jobs",
      count: activeJobs.toString(),
      percentage: calcPercentage(activeJobs, previousActiveJobs),
      isUp: activeJobs >= previousActiveJobs
    },
    {
      title: "Total Applications",
      count: totalApplications.toLocaleString(),
      percentage: calcPercentage(totalApplications, previousApplications),
      isUp: totalApplications >= previousApplications
    },
    {
      title: "Ongoing Interviews",
      count: ongoingInterviews.toString(),
      percentage: calcPercentage(ongoingInterviews, previousOngoingInterviews),
      isUp: ongoingInterviews >= previousOngoingInterviews
    },
    {
      title: "Final Hires",
      count: finalHires.toString(),
      percentage: calcPercentage(finalHires, previousHires),
      isUp: finalHires >= previousHires
    },
    {
      title: "Offer Letters Sent",
      count: offerLettersSent.toString(),
      percentage: calcPercentage(offerLettersSent, previousOffers),
      isUp: offerLettersSent >= previousOffers
    }
  ];
};

// ============================================
// APPLICATIONS TREND (Daily/Weekly/Monthly)
// ============================================
const getApplicationsTrend = async (organizationId) => {
  const [dailyTrend, weeklyTrend, monthlyTrend] = await Promise.all([
    getDailyTrend(organizationId),
    getWeeklyTrend(organizationId),
    getMonthlyTrend(organizationId)
  ]);

  return {
    Daily: dailyTrend,
    Weekly: weeklyTrend,
    Monthly: monthlyTrend
  };
};

const getDailyTrend = async (organizationId) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await Application.countDocuments({
      organizationId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    result.push({
      name: days[startOfDay.getDay()],
      Applications: count
    });
  }

  return result;
};

const getWeeklyTrend = async (organizationId) => {
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (i * 7));
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const count = await Application.countDocuments({
      organizationId,
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const monthDay = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });

    result.push({
      name: monthDay,
      Applications: count
    });
  }

  return result;
};

const getMonthlyTrend = async (organizationId) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const count = await Application.countDocuments({
      organizationId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    result.push({
      name: months[startOfMonth.getMonth()],
      Applications: count
    });
  }

  return result;
};

// ============================================
// PERFORMANCE DATA (Applications/Interviews/Hires)
// ============================================
const getPerformanceData = async (organizationId) => {
  const [weekly, monthly, yearly] = await Promise.all([
    getPerformanceWeekly(organizationId),
    getPerformanceMonthly(organizationId),
    getPerformanceYearly(organizationId)
  ]);

  return {
    Weekly: weekly,
    Monthly: monthly,
    Yearly: yearly
  };
};

// In your backend controller, replace getPerformanceWeekly with this:
const getPerformanceWeekly = async (organizationId) => {
  const result = [];

  for (let i = 3; i >= 0; i--) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - (i * 7));
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    // Get ALL applications and interviews (remove status filters)
    const [applications, interviews, hires] = await Promise.all([
      Application.countDocuments({
        organizationId,
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      ScheduledInterview.countDocuments({
        interviewDate: { $gte: startDate, $lte: endDate }  // Remove status filter
      }),
      Application.countDocuments({
        organizationId,
        status: { $in: ["Hired", "Offered"] },  // Include Offered
        updatedAt: { $gte: startDate, $lte: endDate }
      })
    ]);

    

    result.push({
      name: `Wk ${4 - i}`,
      Applications: applications || 0,
      Interviews: interviews || 0,
      Hires: hires || 0
    });
  }

  return result;
};
const getPerformanceMonthly = async (organizationId) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    const [applications, interviews, hires] = await Promise.all([
      Application.countDocuments({
        organizationId,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      ScheduledInterview.countDocuments({
        status: { $in: ["Completed", "Ongoing", "Scheduled"] }, // Include more statuses
        interviewDate: { $gte: startOfMonth, $lte: endOfMonth }
      }),
      Application.countDocuments({
        organizationId,
        status: { $in: ["Hired", "Offered"] }, // Include Offered status as hires
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
      })
    ]);

    const yearSuffix = startOfMonth.getFullYear() !== new Date().getFullYear()
      ? ` '${startOfMonth.getFullYear().toString().slice(-2)}`
      : '';

    result.push({
      name: `${months[startOfMonth.getMonth()]}${yearSuffix}`,
      Applications: applications,
      Interviews: interviews,
      Hires: hires
    });
  }

  return result;
};

const getPerformanceYearly = async (organizationId) => {
  const currentYear = new Date().getFullYear();
  const result = [];

  for (let i = 3; i >= 0; i--) {
    const year = currentYear - i;
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const [applications, interviews, hires] = await Promise.all([
      Application.countDocuments({
        organizationId,
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }),
      ScheduledInterview.countDocuments({
        status: { $in: ["Completed", "Ongoing"] },
        interviewDate: { $gte: startOfYear, $lte: endOfYear }
      }),
      Application.countDocuments({
        organizationId,
        status: "Hired",
        updatedAt: { $gte: startOfYear, $lte: endOfYear }
      })
    ]);

    result.push({
      name: year.toString(),
      Applications: applications,
      Interviews: interviews,
      Hires: hires
    });
  }

  return result;
};

// ============================================
// JOB DISTRIBUTION BY CATEGORY
// ============================================
const getJobDistribution = async (organizationId) => {
  const distribution = await Application.aggregate([
    {
      $match: {
        organizationId: new mongoose.Types.ObjectId(organizationId)
      }
    },
    {
      $lookup: {
        from: "advertisements",
        localField: "advertisementId",
        foreignField: "_id",
        as: "job"
      }
    },
    { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: { $ifNull: ["$job.department", "Other"] },
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        name: "$_id",
        value: 1,
        _id: 0
      }
    }
  ]);

  const total = distribution.reduce((acc, curr) => acc + curr.value, 0);

  const categoryMapping = {
    "Information Technology": "Tech & Engineering Roles",
    "Finance": "Corporate Financial Audit",
    "Civil Engineering": "Infrastructure Planning",
    "Electrical Engineering": "Power & Automation Systems",
    "Human Resources": "Talent Ops & Management"
  };

  const result = distribution.map(item => ({
    name: item.name || "Other",
    value: total > 0 ? Math.round((item.value / total) * 100) : 0,
    label: categoryMapping[item.name] || `${item.name} Department`
  }));

  return result.sort((a, b) => b.value - a.value).slice(0, 5);
};

// ============================================
// RECENT APPLICATIONS
// ============================================
const getRecentApplications = async (organizationId) => {
  const applications = await Application.find({ organizationId })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate({
      path: 'candidateId',
      select: 'name email',
      model: 'Candidate'
    })
    .populate({
      path: 'advertisementId',
      select: 'jobTitle',
      model: 'Advertisement'
    })
    .lean();

  return applications.map(app => {
    const fullName = app.candidateId?.name || "Unknown";
    const nameParts = fullName.split(" ");
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : fullName.substring(0, 2).toUpperCase();

    const score = app.aiResult?.overallScore || 0;
    let scoreColor = "text-amber-600 bg-amber-50";
    if (score >= 85) scoreColor = "text-emerald-600 bg-emerald-50";
    else if (score >= 70) scoreColor = "text-blue-600 bg-blue-50";

    const statusMapping = {
      "Applied": "bg-slate-100 text-slate-700",
      "Bookmarked": "bg-purple-50 text-purple-600",
      "Shortlisted": "bg-emerald-50 text-emerald-600",
      "Interview": "bg-blue-50 text-blue-600",
      "Rejected": "bg-red-50 text-red-600",
      "Offered": "bg-cyan-50 text-cyan-600",
      "Hired": "bg-green-50 text-green-600"
    };

    const statusLabels = {
      "Applied": "Applied",
      "Bookmarked": "Bookmarked",
      "Shortlisted": "Shortlisted",
      "Interview": "Interview Scheduled",
      "Rejected": "Rejected",
      "Offered": "Offered",
      "Hired": "Hired"
    };

    return {
      name: fullName,
      email: app.candidateId?.email || "N/A",
      initial: initials,
      job: app.advertisementId?.jobTitle || "N/A",
      date: new Date(app.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      score: score,
      scoreColor: scoreColor,
      status: statusLabels[app.status] || app.status,
      statusStyle: statusMapping[app.status] || "bg-slate-50 text-slate-600"
    };
  });
};

// ============================================
// OFFER LETTER STATISTICS
// ============================================
const getOfferLetterStats = async (organizationId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [sentToday, accepted, pending] = await Promise.all([
    Application.countDocuments({
      organizationId,
      status: "Offered",
      updatedAt: { $gte: today, $lt: tomorrow }
    }),
    Application.countDocuments({ organizationId, status: "Hired" }),
    Application.countDocuments({ organizationId, status: "Offered" })
  ]);

  return [
    { name: "Sent Today", value: sentToday },
    { name: "Accepted", value: accepted },
    { name: "Pending", value: pending }
  ];
};

// ============================================
// TODAY'S INTERVIEWS
// ============================================
const getTodayInterviews = async (organizationId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const interviews = await ScheduledInterview.find({
    interviewDate: { $gte: today, $lt: tomorrow }
  })
    .populate({
      path: 'applicationId',
      select: 'candidateId status advertisementId',
      populate: [
        {
          path: 'candidateId',
          select: 'name',
          model: 'Candidate'
        },
        {
          path: 'advertisementId',
          select: 'jobTitle',
          model: 'Advertisement'
        }
      ]
    })
    .populate({
      path: 'interviewerId',
      select: 'name type',
      model: 'Interviewer'
    })
    .sort({ interviewTime: 1 })
    .lean();

  return interviews;
};

// ============================================
// UPCOMING INTERVIEWS
// ============================================
const getUpcomingInterviews = async (organizationId) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const interviews = await ScheduledInterview.find({
    interviewDate: { $gt: today },
    status: "Scheduled"
  })
    .populate({
      path: 'applicationId',
      select: 'candidateId status advertisementId',
      populate: [
        {
          path: 'candidateId',
          select: 'name',
          model: 'Candidate'
        },
        {
          path: 'advertisementId',
          select: 'jobTitle',
          model: 'Advertisement'
        }
      ]
    })
    .sort({ interviewDate: 1, interviewTime: 1 })
    .limit(5)
    .lean();

  return interviews.map(interview => ({
    name: interview.applicationId?.candidateId?.name || "Unknown",
    position: interview.applicationId?.advertisementId?.jobTitle || "Position",
    time: interview.interviewTime,
    date: interview.interviewDate
  }));
};

// ============================================
// SCHEDULE INTERVIEWS FOR SPECIFIC DATE
// ============================================
export const getScheduleByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const organizationId = req.organizationId;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const interviews = await ScheduledInterview.find({
      interviewDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate({
        path: 'applicationId',
        select: 'candidateId status',
        populate: {
          path: 'candidateId',
          select: 'name',
          model: 'Candidate'
        }
      })
      .populate({
        path: 'interviewerId',
        select: 'name type',
        model: 'Interviewer'
      })
      .sort({ interviewTime: 1 })
      .lean();

    const agenda = interviews.map(interview => ({
      time: interview.interviewTime,
      event: interview.interviewerId?.type || "Interview",
      details: interview.applicationId?.candidateId?.name || "Candidate"
    }));

    const ongoing = interviews.find(int => int.status === "Ongoing");
    const live = ongoing ? {
      name: ongoing.applicationId?.candidateId?.name || "Unknown",
      role: ongoing.applicationId?.status || "Candidate",
      host: `${ongoing.interviewerId?.type || "Interview"} • ${ongoing.interviewerId?.name || "Host"}`,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } : null;

    const upcoming = interviews
      .filter(int => int.status === "Scheduled")
      .map(int => ({
        name: int.applicationId?.candidateId?.name || "Unknown",
        position: int.interviewerId?.type || "Position",
        time: int.interviewTime
      }));

    res.status(200).json({
      success: true,
      data: {
        agenda,
        live,
        upcoming
      }
    });
  } catch (error) {
    console.error("Schedule By Date Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedule"
    });
  }
};

// ============================================
// INTERVIEW DETAILS FOR SPECIFIC APPLICATION
// ============================================
export const getInterviewDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const organizationId = req.organizationId;

    const interview = await ScheduledInterview.findOne({ applicationId })
      .populate({
        path: 'applicationId',
        select: 'candidateId status roundResults currentRound',
        populate: {
          path: 'candidateId',
          select: 'name email phone',
          model: 'Candidate'
        }
      })
      .populate({
        path: 'interviewerId',
        select: 'name email type',
        model: 'Interviewer'
      })
      .lean();

    if (!interview) {
      return res.status(404).json({ success: false, message: "Interview not found" });
    }

    const application = await Application.findById(applicationId);
    if (!application || application.organizationId.toString() !== organizationId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    console.error("Interview Details Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch interview details" });
  }
};

// ============================================
// APPLICATION ANALYTICS SUMMARY
// ============================================
export const getApplicationAnalytics = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const { range = "30d" } = req.query;

    const endDate = new Date();
    let startDate;
    switch (range) {
      case "7d": startDate = new Date(endDate - 7 * 24 * 60 * 60 * 1000); break;
      case "90d": startDate = new Date(endDate - 90 * 24 * 60 * 60 * 1000); break;
      case "1y": startDate = new Date(endDate); startDate.setFullYear(startDate.getFullYear() - 1); break;
      default: startDate = new Date(endDate - 30 * 24 * 60 * 60 * 1000);
    }

    const analytics = await Application.aggregate([
      { $match: { organizationId: new mongoose.Types.ObjectId(organizationId), createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$status", count: { $sum: 1 }, avgScore: { $avg: "$aiResult.overallScore" } } },
      { $project: { status: "$_id", count: 1, avgScore: { $round: ["$avgScore", 1] }, _id: 0 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown: analytics,
        totalApplications: analytics.reduce((acc, curr) => acc + curr.count, 0)
      }
    });
  } catch (error) {
    console.error("Application Analytics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};

// ============================================
// PIPELINE STAGE METRICS
// ============================================
export const getPipelineMetrics = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const pipelineStages = ["Applied", "Bookmarked", "Shortlisted", "Interview", "Offered", "Hired", "Rejected"];

    const metrics = await Promise.all(pipelineStages.map(async (stage) => {
      const count = await Application.countDocuments({ organizationId, status: stage });
      const avgTime = await Application.aggregate([
        { $match: { organizationId: new mongoose.Types.ObjectId(organizationId), status: stage } },
        { $group: { _id: null, avgDaysInStage: { $avg: { $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 1000 * 60 * 60 * 24] } } } }
      ]);
      return { stage, count, avgDaysInStage: avgTime[0]?.avgDaysInStage ? Math.round(avgTime[0].avgDaysInStage * 10) / 10 : 0 };
    }));

    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error("Pipeline Metrics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch pipeline metrics" });
  }
};

// ============================================
// INTERVIEWER PERFORMANCE METRICS
// ============================================
export const getInterviewerMetrics = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const interviewers = await Interviewer.find({ organizationId }).select('name email type').lean();

    const metrics = await Promise.all(interviewers.map(async (interviewer) => {
      const [completed, ongoing, scheduled] = await Promise.all([
        ScheduledInterview.countDocuments({ interviewerId: interviewer._id, status: "Completed" }),
        ScheduledInterview.countDocuments({ interviewerId: interviewer._id, status: "Ongoing" }),
        ScheduledInterview.countDocuments({ interviewerId: interviewer._id, status: "Scheduled" })
      ]);

      const avgRatings = await Application.aggregate([
        { $match: { organizationId: new mongoose.Types.ObjectId(organizationId) } },
        { $unwind: "$roundResults" },
        { $match: { "roundResults.interviewerId": interviewer._id } },
        {
          $group: {
            _id: null,
            avgTechnical: { $avg: "$roundResults.evaluation.technicalSkills" },
            avgProblemSolving: { $avg: "$roundResults.evaluation.problemSolving" },
            avgCommunication: { $avg: "$roundResults.evaluation.communication" },
            avgBehavioral: { $avg: "$roundResults.evaluation.behavioralSkills" },
            avgCultural: { $avg: "$roundResults.evaluation.culturalFit" }
          }
        }
      ]);

      return {
        interviewerId: interviewer._id,
        name: interviewer.name,
        email: interviewer.email,
        type: interviewer.type,
        completedInterviews: completed,
        ongoingInterviews: ongoing,
        scheduledInterviews: scheduled,
        avgRatings: avgRatings[0] || { avgTechnical: 0, avgProblemSolving: 0, avgCommunication: 0, avgBehavioral: 0, avgCultural: 0 }
      };
    }));

    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error("Interviewer Metrics Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch interviewer metrics" });
  }
};