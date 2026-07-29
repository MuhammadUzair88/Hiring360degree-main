/**
 * organization/jobAdvertisement/candidateIntake/data.js
 * ------------------------------------------------------------------
 * Dummy applicant records + status constants for the Candidate Intake
 * board. Field names mirror what the backend's application/AI-scoring
 * endpoints already return — `id` is the application id used in every
 * PUT route referenced from CandidateIntakeOverview.jsx (bookmark,
 * shortlist, move, reject). Swap getCandidatesByJobId for a real
 * GET /api/application/job/:jobId call once that route exists; every
 * component in this folder only ever reads off the `candidate` shape
 * below, never off this array directly.
 * ------------------------------------------------------------------
 */

export const CANDIDATE_STATUS = {
  PENDING: "Pending",
  BOOKMARKED: "Bookmarked",
  SHORTLISTED: "Shortlisted",
};

// All dummy candidates below are attached to this one sample job id.
// If the job id in your URL doesn't match this, getCandidatesByJobId
// falls back to returning every dummy candidate anyway (see below) so
// you can still see the board populated while wiring things up.
const SAMPLE_JOB_ID = "6a6505edf4f0af318b5084d0";

export const candidateIntakeList = [
  {
    id: "6b1f0a2c4f0af318b5084e01",
    jobId: SAMPLE_JOB_ID,
    name: "Moin Haider",
    email: "moinhaiderqadir@gmail.com",
    status: CANDIDATE_STATUS.PENDING,
    appliedAt: "2026-07-25T10:00:00Z",
    resume: { url: "/resumes/moin-haider.pdf", pageCount: 3 },
    aiEvaluation: {
      matchScore: 91,
      verdict: "Strong Hire",
      verdictSummary: "Exceeds key requirements. Move to interview.",
      experience: "8 mos",
      educationScore: 80,
      riskLevel: "Medium",
      flagsCount: 1,
      scorecard: [
        { key: "skillsMatch", label: "Skills Match", score: 100, note: "1 of 1 required" },
        { key: "experienceFit", label: "Experience Fit", score: 90, note: "8 mos detected" },
        { key: "educationLevel", label: "Education Level", score: 80, note: "Score: 80%" },
        { key: "atsCompatibility", label: "ATS Compatibility", score: 75, note: "2 formatting issues" },
      ],
      summary:
        "Moin Haider is an exceptional match for the Alpha role, possessing the required React skills and exceeding the minimum experience threshold. The candidate demonstrates strong technical proficiency through multiple completed projects and relevant internship experience.",
      skills: {
        qualified: ["React"],
        gaps: [],
        additional: ["Node.js", "MongoDB", "TypeScript", "Tailwind CSS"],
      },
      keyAchievements: ["Completed a 7-week MERN stack internship building two production-grade applications"],
      strengths: [
        "Strong alignment with MERN stack requirements",
        "Demonstrated ability to deliver end-to-end projects",
        "Relevant technical education in progress",
      ],
      concerns: {
        level: "Medium",
        items: ["Short-term contract roles (job hopping pattern, though common for entry-level)"],
      },
      resumeFormattingIssues: [
        "No quantifiable achievements (metrics) provided for professional roles",
        "Missing specific action-oriented impact statements",
      ],
      detailedAnalysis:
        "Full scoring breakdown: keyword overlap against the job description, section-by-section resume parsing, and the specific signals that drove the ATS compatibility and risk scores above.",
    },
  },
  {
    id: "6b1f0a2c4f0af318b5084e02",
    jobId: SAMPLE_JOB_ID,
    name: "Sumit Sharma",
    email: "sharma.sumit.6574@gmail.com",
    status: CANDIDATE_STATUS.SHORTLISTED,
    appliedAt: "2026-07-24T09:30:00Z",
    resume: { url: "/resumes/sumit-sharma.pdf", pageCount: 2 },
    aiEvaluation: {
      matchScore: 96,
      verdict: "Strong Hire",
      verdictSummary: "Exceeds key requirements. Move to interview.",
      experience: "1 yr 4 mos",
      educationScore: 88,
      riskLevel: "Low",
      flagsCount: 0,
      scorecard: [
        { key: "skillsMatch", label: "Skills Match", score: 100, note: "4 of 4 required" },
        { key: "experienceFit", label: "Experience Fit", score: 95, note: "1 yr 4 mos detected" },
        { key: "educationLevel", label: "Education Level", score: 88, note: "Score: 88%" },
        { key: "atsCompatibility", label: "ATS Compatibility", score: 92, note: "No formatting issues" },
      ],
      summary:
        "Sumit Sharma exceeds the requirements for this role with hands-on production experience across the full stack and a consistently strong track record of ownership.",
      skills: {
        qualified: ["React", "Node.js", "MongoDB", "TypeScript"],
        gaps: [],
        additional: ["Docker", "AWS"],
      },
      keyAchievements: ["Shipped a customer-facing dashboard used by 10,000+ monthly active users"],
      strengths: [
        "Deep familiarity with the exact tech stack used on this team",
        "Clear, metric-driven descriptions of past impact",
        "Stable employment history with steady growth",
      ],
      concerns: {
        level: "Low",
        items: ["No major concerns identified"],
      },
      resumeFormattingIssues: [],
      detailedAnalysis:
        "Full scoring breakdown: keyword overlap against the job description, section-by-section resume parsing, and the specific signals that drove the ATS compatibility and risk scores above.",
    },
  },
  {
    id: "6b1f0a2c4f0af318b5084e03",
    jobId: SAMPLE_JOB_ID,
    name: "Ayesha Khan",
    email: "ayesha.khan.dev@gmail.com",
    status: CANDIDATE_STATUS.BOOKMARKED,
    appliedAt: "2026-07-23T14:15:00Z",
    resume: { url: "/resumes/ayesha-khan.pdf", pageCount: 2 },
    aiEvaluation: {
      matchScore: 84,
      verdict: "Strong Hire",
      verdictSummary: "Solid match. Worth a closer look.",
      experience: "2 yrs 1 mo",
      educationScore: 76,
      riskLevel: "Low",
      flagsCount: 0,
      scorecard: [
        { key: "skillsMatch", label: "Skills Match", score: 90, note: "3 of 4 required" },
        { key: "experienceFit", label: "Experience Fit", score: 85, note: "2 yrs 1 mo detected" },
        { key: "educationLevel", label: "Education Level", score: 76, note: "Score: 76%" },
        { key: "atsCompatibility", label: "ATS Compatibility", score: 88, note: "1 formatting issue" },
      ],
      summary:
        "Ayesha Khan brings solid, well-rounded frontend experience with clear ownership of past projects, though she is missing one of the four required skills listed on the job description.",
      skills: {
        qualified: ["React", "TypeScript", "Tailwind CSS"],
        gaps: ["GraphQL"],
        additional: ["Figma", "Storybook"],
      },
      keyAchievements: ["Led a component library rewrite adopted across 3 product teams"],
      strengths: [
        "Strong design-to-code collaboration experience",
        "Consistent, well-documented project history",
      ],
      concerns: {
        level: "Low",
        items: ["No hands-on GraphQL experience listed"],
      },
      resumeFormattingIssues: ["Contact section missing a phone number"],
      detailedAnalysis:
        "Full scoring breakdown: keyword overlap against the job description, section-by-section resume parsing, and the specific signals that drove the ATS compatibility and risk scores above.",
    },
  },
  {
    id: "6b1f0a2c4f0af318b5084e04",
    jobId: SAMPLE_JOB_ID,
    name: "Bilal Ahmed",
    email: "bilal.ahmed.eng@gmail.com",
    status: CANDIDATE_STATUS.PENDING,
    appliedAt: "2026-07-26T08:45:00Z",
    resume: { url: "/resumes/bilal-ahmed.pdf", pageCount: 1 },
    aiEvaluation: {
      matchScore: 58,
      verdict: "Weak Match",
      verdictSummary: "Below key requirements. Review carefully.",
      experience: "3 mos",
      educationScore: 65,
      riskLevel: "High",
      flagsCount: 2,
      scorecard: [
        { key: "skillsMatch", label: "Skills Match", score: 50, note: "2 of 4 required" },
        { key: "experienceFit", label: "Experience Fit", score: 40, note: "3 mos detected" },
        { key: "educationLevel", label: "Education Level", score: 65, note: "Score: 65%" },
        { key: "atsCompatibility", label: "ATS Compatibility", score: 55, note: "4 formatting issues" },
      ],
      summary:
        "Bilal Ahmed shows some foundational skills relevant to the role but falls short on required experience and is missing two of the four core requirements listed on the job description.",
      skills: {
        qualified: ["JavaScript"],
        gaps: ["React", "TypeScript"],
        additional: ["jQuery"],
      },
      keyAchievements: ["Built a personal portfolio site as part of a coding bootcamp capstone"],
      strengths: ["Eager to learn, active in personal projects"],
      concerns: {
        level: "High",
        items: [
          "Minimal professional experience relative to role requirements",
          "Missing two required core skills",
        ],
      },
      resumeFormattingIssues: [
        "No work history section",
        "Inconsistent date formatting throughout",
        "Missing links to project work",
        "No quantifiable achievements provided",
      ],
      detailedAnalysis:
        "Full scoring breakdown: keyword overlap against the job description, section-by-section resume parsing, and the specific signals that drove the ATS compatibility and risk scores above.",
    },
  },
];

/**
 * Simulates GET /api/application/job/:jobId against the dummy list above.
 *
 * DEV-ONLY FALLBACK: if the requested jobId has no matching candidates
 * (e.g. your job records use different ids than SAMPLE_JOB_ID above),
 * this returns every dummy candidate instead of an empty board, purely
 * so the Candidate Intake UI is visible while you're testing layout.
 * Delete the fallback once this is wired to a real backend — a real
 * empty result should render the empty-state columns, not dummy data.
 */
export function getCandidatesByJobId(jobId) {
  const matches = candidateIntakeList.filter((candidate) => candidate.jobId === jobId);
  if (matches.length > 0) return matches;
  return candidateIntakeList;
}