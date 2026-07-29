// services/gemini/deterministic/index.js

import { SCORING_WEIGHTS } from '../../../config/constants.js';
import { scoringUtils } from '../../../utils/resumehandlers/scoringUtils.js';
import { calculateSkillsScore } from './skillsScore.js';
import { calculateExperienceScore } from './experienceScore.js';
import { calculateEducationScore } from './educationScore.js';
import { calculateATSScore } from './atsScore.js';
import { extractAchievements } from './achievements.js';
import { buildReasoning } from './reasoning.js';
import { buildStrengths } from './strengths.js';
import { buildRedFlags } from './redFlags.js';
import { buildSummary } from './summary.js';

export const calculateDeterministicScores = (resumeText, advertisement) => {
  const skillsResult = calculateSkillsScore(resumeText, advertisement);
  const experienceResult = calculateExperienceScore(resumeText, advertisement);
  const educationResult = calculateEducationScore(resumeText);
  const atsResult = calculateATSScore(resumeText);
  
  // Dynamic weights based on whether experience is required
  const isEntryLevel = experienceResult.requiredYears === 0;
  const weights = isEntryLevel ? SCORING_WEIGHTS.ENTRY_LEVEL : SCORING_WEIGHTS.STANDARD;
  
  const overallScore = scoringUtils.calculateOverallScore({
    skills: skillsResult.score,
    experience: experienceResult.score,
    education: educationResult.score,
    ats: atsResult.score
  }, weights);

  return {
    overallScore,
    totalMatchScore: overallScore,
    skillsScore: skillsResult.score,
    experienceScore: experienceResult.score,
    educationScore: educationResult.score,
    atsScore: atsResult.score,
    breakdown: {
      skillsScore: skillsResult.score,
      experienceScore: experienceResult.score,
      educationScore: educationResult.score,
      atsReadabilityScore: atsResult.score
    },
    scoringWeights: {
      skills: weights.SKILLS,
      experience: weights.EXPERIENCE,
      education: weights.EDUCATION,
      ats: weights.ATS,
      type: isEntryLevel ? 'entry_level' : 'standard'
    },
    reasoning: buildReasoning(skillsResult, experienceResult, educationResult, atsResult),
    matchedSkills: skillsResult.matched || [],
    missingSkills: skillsResult.missing || [],
    bonusSkills: [],
    candidateExperienceYears: experienceResult.candidateYears,
    quantifiableAchievements: extractAchievements(resumeText),
    atsFormattingFlags: atsResult.flags,
    strengths: buildStrengths(skillsResult, experienceResult, educationResult),
    redFlags: buildRedFlags(skillsResult, experienceResult, atsResult),
    summary: buildSummary(skillsResult, experienceResult, educationResult, atsResult),
    aiEnhanced: false,
    analysisType: 'deterministic'
  };
};