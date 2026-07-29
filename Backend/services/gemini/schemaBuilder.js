// services/gemini/schemaBuilder.js

export const buildAnalysisSchema = () => ({
  type: "object",
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    totalMatchScore: { type: "integer", minimum: 0, maximum: 100 },
    skillsScore: { type: "integer", minimum: 0, maximum: 100 },
    experienceScore: { type: "integer", minimum: 0, maximum: 100 },
    educationScore: { type: "integer", minimum: 0, maximum: 100 },
    atsScore: { type: "integer", minimum: 0, maximum: 100 },
    breakdown: {
      type: "object",
      properties: {
        skillsScore: { type: "integer" },
        experienceScore: { type: "integer" },
        educationScore: { type: "integer" },
        atsReadabilityScore: { type: "integer" }
      },
      required: ["skillsScore", "experienceScore", "educationScore", "atsReadabilityScore"]
    },
    reasoning: { type: "string" },
    matchedSkills: { type: "array", items: { type: "string" } },
    missingSkills: { type: "array", items: { type: "string" } },
    bonusSkills: { type: "array", items: { type: "string" } },
    candidateExperienceYears: { type: "number" },
    quantifiableAchievements: { type: "array", items: { type: "string" } },
    atsFormattingFlags: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    redFlags: { type: "array", items: { type: "string" } },
    summary: { type: "string" }
  },
  required: ["overallScore", "skillsScore", "experienceScore", "educationScore", "atsScore", "summary"]
});