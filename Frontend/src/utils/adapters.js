// src/utils/adapters.js
//
// The presentational components in components/organization/** were built
// against specific mock-data shapes (see the sibling data.js files). Rather
// than rewrite every card/table component's prop contract, these adapters
// translate real API documents into those same shapes at the boundary,
// keeping the components themselves untouched and reusable.
import { formatDate } from "./formatters";
import { Briefcase, FileStack, Video, UserCheck2, Send } from "lucide-react";

const ACCENT_CYCLE = [
  { text: "text-primary-700", bg: "bg-primary-700/10" },
  { text: "text-primary-800", bg: "bg-primary-800/10" },
  { text: "text-primary-600", bg: "bg-primary-600/10" },
  { text: "text-primary-900", bg: "bg-primary-900/10" },
];

function accentForIndex(index) {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length];
}

/** Advertisement (backend) -> AdvertisementCard props */
export function mapAdvertisementToCard(ad, index = 0, applicantsCount) {
  const accent = accentForIndex(index);
  return {
    id: ad._id,
    departmentLabel: ad.department || "General",
    accentTextClass: accent.text,
    accentBgClass: accent.bg,
    typeLabel: ad.employmentType || "Full-Time",
    title: ad.jobTitle,
    company: ad.organization?.name || "Your Company",
    location: ad.location || ad.workMode || "—",
    salary: ad.salary,
    postedDate: formatDate(ad.createdAt),
    endDate: formatDate(ad.deadline),
    tags: ad.skills || [],
    applicantsCount: applicantsCount ?? "—",
  };
}

/** Application (backend, populated candidateId + aiResult) -> CandidateCard shape */
const STATUS_BACKEND_TO_UI = {
  Applied: "Pending",
  Bookmarked: "Bookmarked",
  Shortlisted: "Shortlisted",
  Interview: "Shortlisted",
  Offered: "Shortlisted",
  Hired: "Shortlisted",
};

export function mapApplicationStatusToUi(status) {
  return STATUS_BACKEND_TO_UI[status] || "Pending";
}

const UI_STATUS_TO_BACKEND = {
  Pending: "Applied",
  Bookmarked: "Bookmarked",
  Shortlisted: "Shortlisted",
};

export function mapUiStatusToBackend(status) {
  return UI_STATUS_TO_BACKEND[status] || status;
}

function scoreVerdict(score) {
  if (score >= 85) return "Strong Hire";
  if (score >= 65) return "Good Fit";
  if (score >= 45) return "Possible Fit";
  return "Weak Match";
}

export function mapApplicationToCandidate(application) {
  const ai = application.aiResult;
  const hasAnalysis = ai && ai.analysisStatus === "completed";

  return {
    id: application._id,
    jobId: application.advertisementId,
    name: application.candidateId?.name || "Unknown candidate",
    email: application.candidateId?.email || "",
    status: mapApplicationStatusToUi(application.status),
    appliedAt: application.createdAt,
    resume: { url: application.resume?.url, pageCount: null },
    analysisStatus: ai?.analysisStatus || "not_started",
    aiEvaluation: hasAnalysis
      ? {
          matchScore: ai.overallScore ?? ai.totalMatchScore ?? 0,
          verdict: scoreVerdict(ai.overallScore ?? 0),
          verdictSummary: ai.summary,
          experience: ai.candidateExperienceYears != null ? `${ai.candidateExperienceYears} yrs` : "—",
          educationScore: ai.educationScore ?? ai.breakdown?.educationScore ?? 0,
          riskLevel: (ai.redFlags?.length || 0) > 2 ? "High" : (ai.redFlags?.length || 0) > 0 ? "Medium" : "Low",
          flagsCount: ai.redFlags?.length || 0,
          scorecard: [
            { key: "skillsMatch", label: "Skills Match", score: ai.skillsScore ?? 0, note: `${ai.matchedSkills?.length || 0} matched` },
            { key: "experienceFit", label: "Experience Fit", score: ai.experienceScore ?? 0, note: `${ai.candidateExperienceYears ?? 0} yrs detected` },
            { key: "educationLevel", label: "Education Level", score: ai.educationScore ?? 0, note: `Score: ${ai.educationScore ?? 0}%` },
            { key: "atsCompatibility", label: "ATS Compatibility", score: ai.atsScore ?? 0, note: `${ai.atsFormattingFlags?.length || 0} formatting issues` },
          ],
          summary: ai.summary || "",
          skills: {
            qualified: ai.matchedSkills || [],
            gaps: ai.missingSkills || [],
            additional: ai.bonusSkills || [],
          },
          keyAchievements: ai.quantifiableAchievements || [],
          strengths: ai.strengths || [],
          concerns: {
            level: (ai.redFlags?.length || 0) > 2 ? "High" : (ai.redFlags?.length || 0) > 0 ? "Medium" : "Low",
            items: ai.redFlags || [],
          },
          resumeFormattingIssues: ai.atsFormattingFlags || [],
          detailedAnalysis: ai.reasoning || "",
        }
      : null,
  };
}

/** Backend KPI card (title/count/percentage/isUp) -> StatMetricCard props */
const KPI_ICON_BY_TITLE = {
  "Active Jobs": Briefcase,
  "Total Applications": FileStack,
  "Ongoing Interviews": Video,
  "Final Hires": UserCheck2,
  "Offer Letters Sent": Send,
};

export function mapKpiCardsToStats(kpiCards = []) {
  return kpiCards.map((card, index) => ({
    id: card.title.toLowerCase().replace(/\s+/g, "-") || `kpi-${index}`,
    label: card.title,
    value: card.count,
    icon: KPI_ICON_BY_TITLE[card.title] || Briefcase,
    badgeClass: "bg-primary-50 text-primary-800",
    trend: {
      direction: card.isUp ? "up" : "down",
      label: `${card.percentage} vs last 30 days`,
      toneClass: card.isUp ? "text-emerald-600" : "text-red-600",
    },
  }));
}

/** Backend day-schedule agenda item -> DaySchedulePanel item shape */
export function mapAgendaItems(agenda = []) {
  return agenda.map((item, index) => ({
    id: `${item.time}-${index}`,
    time: item.time,
    title: item.event,
    details: item.details,
  }));
}

export function mapAdvertisementToJobOverview(ad, pamphlet, organizationName) {
  return {
    ...ad,
    organization: { name: organizationName || ad.organization?.name || "Your Company" },
    generatedImageUrl: pamphlet?.generatedImageUrl || null,
  };
}
