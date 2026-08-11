import { Advertisement } from "../models/advertisementModel.js";
import { Application } from "../models/applicationModel.js";
import { Candidate } from "../models/candidateModel.js";
import { Interviewer } from "../models/interviewerModel.js";
import { ScheduledInterview } from "../models/interviewModel.js";

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function candidateIntakeRoute(advertisementId) {
  return advertisementId
    ? `/advertisement/job/${advertisementId}/candidate-intake`
    : "/advertisement";
}

/**
 * Header global search backed only by records belonging to the authenticated
 * organization. It searches jobs, interviewers, and candidates/applications.
 */
export const searchWorkspace = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const query = String(req.query.q || "").trim();

    if (query.length < 2) {
      return res.status(200).json({ success: true, results: [] });
    }

    const regex = new RegExp(escapeRegex(query), "i");

    const [jobs, interviewers, candidateMatches] = await Promise.all([
      Advertisement.find({
        organizationId,
        $or: [
          { jobTitle: regex },
          { department: regex },
          { location: regex },
        ],
      })
        .select("jobTitle department location status")
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),

      Interviewer.find({
        organizationId,
        $or: [{ name: regex }, { email: regex }, { type: regex }],
      })
        .select("name email type")
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),

      Candidate.find({
        $or: [{ name: regex }, { email: regex }, { phone: regex }],
      })
        .select("name email phone")
        .limit(20)
        .lean(),
    ]);

    const candidateIds = candidateMatches.map((candidate) => candidate._id);

    const candidateApplications = candidateIds.length
      ? await Application.find({
          organizationId,
          candidateId: { $in: candidateIds },
        })
          .populate("candidateId", "name email phone")
          .populate("advertisementId", "jobTitle department")
          .sort({ updatedAt: -1 })
          .limit(8)
          .lean()
      : [];

    const results = [
      ...jobs.map((job) => ({
        id: String(job._id),
        type: "job",
        title: job.jobTitle || "Untitled job",
        subtitle: [job.department, job.location, job.status].filter(Boolean).join(" · "),
        route: `/advertisement/job/${job._id}`,
      })),

      ...candidateApplications.map((application) => ({
        id: String(application._id),
        type: "candidate",
        title: application.candidateId?.name || "Candidate",
        subtitle: [
          application.candidateId?.email,
          application.advertisementId?.jobTitle,
          application.status,
        ]
          .filter(Boolean)
          .join(" · "),
        route: candidateIntakeRoute(application.advertisementId?._id),
      })),

      ...interviewers.map((interviewer) => ({
        id: String(interviewer._id),
        type: "interviewer",
        title: interviewer.name || "Interviewer",
        subtitle: [interviewer.email, interviewer.type].filter(Boolean).join(" · "),
        route: "/interviewer",
      })),
    ];

    return res.status(200).json({
      success: true,
      results: results.slice(0, 15),
    });
  } catch (error) {
    console.error("Header search error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to search the workspace.",
    });
  }
};

/**
 * Real workspace events for the notification bell. No fake counters are used.
 * The frontend owns the lightweight "last viewed" timestamp; this endpoint
 * simply returns real recent activity.
 */
export const getWorkspaceNotifications = async (req, res) => {
  try {
    const organizationId = req.organizationId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);

    const applicationIdDocs = await Application.find({ organizationId })
      .select("_id")
      .lean();
    const applicationIds = applicationIdDocs.map((item) => item._id);

    const [recentApplications, statusUpdates, upcomingInterviews] = await Promise.all([
      Application.find({
        organizationId,
        createdAt: { $gte: sevenDaysAgo },
      })
        .populate("candidateId", "name email")
        .populate("advertisementId", "jobTitle")
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),

      Application.find({
        organizationId,
        status: { $in: ["Offered", "Hired"] },
        updatedAt: { $gte: sevenDaysAgo },
      })
        .populate("candidateId", "name email")
        .populate("advertisementId", "jobTitle")
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean(),

      applicationIds.length
        ? ScheduledInterview.find({
            applicationId: { $in: applicationIds },
            status: { $in: ["Scheduled", "Ongoing"] },
            interviewDate: { $gte: startToday },
          })
            .populate({
              path: "applicationId",
              select: "candidateId advertisementId",
              populate: [
                { path: "candidateId", select: "name email" },
                { path: "advertisementId", select: "jobTitle" },
              ],
            })
            .populate("interviewerId", "name")
            .sort({ interviewDate: 1, interviewTime: 1 })
            .limit(6)
            .lean()
        : [],
    ]);

    const notifications = [];

    for (const application of recentApplications) {
      const candidateName = application.candidateId?.name || "A candidate";
      const jobTitle = application.advertisementId?.jobTitle || "a job";

      notifications.push({
        id: `application-${application._id}`,
        type: "application",
        title: "New application",
        message: `${candidateName} applied for ${jobTitle}.`,
        createdAt: application.createdAt,
        route: candidateIntakeRoute(application.advertisementId?._id),
      });
    }

    for (const application of statusUpdates) {
      const candidateName = application.candidateId?.name || "Candidate";
      const jobTitle = application.advertisementId?.jobTitle || "the position";
      const isHired = application.status === "Hired";

      notifications.push({
        id: `${application.status.toLowerCase()}-${application._id}`,
        type: isHired ? "hire" : "offer",
        title: isHired ? "Candidate hired" : "Offer stage updated",
        message: isHired
          ? `${candidateName} was hired for ${jobTitle}.`
          : `${candidateName} is now in the offer stage for ${jobTitle}.`,
        createdAt: application.updatedAt,
        route: isHired
          ? candidateIntakeRoute(application.advertisementId?._id)
          : application.advertisementId?._id
            ? `/advertisement/job/${application.advertisementId._id}/offer-letter`
            : "/advertisement",
      });
    }

    for (const interview of upcomingInterviews) {
      const application = interview.applicationId;
      const candidateName = application?.candidateId?.name || "Candidate";
      const interviewerName = interview.interviewerId?.name || "Interviewer";
      const jobTitle = application?.advertisementId?.jobTitle || "the position";
      const date = safeDate(interview.interviewDate);

      notifications.push({
        id: `interview-${interview._id}`,
        type: "interview",
        title: interview.status === "Ongoing" ? "Interview in progress" : "Upcoming interview",
        message: `${candidateName} · ${jobTitle} · ${interviewerName}${
          interview.interviewTime ? ` · ${interview.interviewTime}` : ""
        }`,
        createdAt: interview.status === "Ongoing" ? interview.updatedAt : date || interview.createdAt,
        route: application?.advertisementId?._id
          ? `/advertisement/job/${application.advertisementId._id}/rounds`
          : "/advertisement",
      });
    }

    notifications.sort((a, b) => {
      const aTime = safeDate(a.createdAt)?.getTime() || 0;
      const bTime = safeDate(b.createdAt)?.getTime() || 0;
      return bTime - aTime;
    });

    return res.status(200).json({
      success: true,
      notifications: notifications.slice(0, 12),
    });
  } catch (error) {
    console.error("Header notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load notifications.",
    });
  }
};

/**
 * The mail icon exposes real recent candidate contacts. Clicking a contact
 * uses the browser's mail client through mailto:, so the button is useful
 * without inventing a fake inbox that the backend does not actually have.
 */
export const getRecentCandidateContacts = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const applications = await Application.find({ organizationId })
      .populate("candidateId", "name email phone")
      .populate("advertisementId", "jobTitle")
      .sort({ updatedAt: -1 })
      .limit(30)
      .lean();

    const seenCandidates = new Set();
    const contacts = [];

    for (const application of applications) {
      const candidate = application.candidateId;
      if (!candidate?._id || !candidate.email) continue;

      const key = String(candidate._id);
      if (seenCandidates.has(key)) continue;
      seenCandidates.add(key);

      contacts.push({
        id: key,
        applicationId: String(application._id),
        name: candidate.name || "Candidate",
        email: candidate.email,
        phone: candidate.phone || "",
        jobTitle: application.advertisementId?.jobTitle || "",
        route: candidateIntakeRoute(application.advertisementId?._id),
        updatedAt: application.updatedAt,
      });

      if (contacts.length >= 8) break;
    }

    return res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Header contacts error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load candidate contacts.",
    });
  }
};
