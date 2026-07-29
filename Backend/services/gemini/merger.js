// services/gemini/merger.js

import { scoringUtils } from '../../utils/resumehandlers/scoringUtils.js';
import { crossValidateScores, validateOverallScore } from './validator.js';
import { logger } from '../../utils/resumehandlers/logger.js';

export const mergeScores = (aiResult, deterministicScores) => {
  if (!aiResult?.parsed) {
    logger.info('Using deterministic scores (no AI result)');
    return deterministicScores;
  }

  const ai = aiResult.parsed;
  
  const aiScores = {
    skillsScore: ai.skillsScore ?? ai.breakdown?.skillsScore,
    experienceScore: ai.experienceScore ?? ai.breakdown?.experienceScore,
    educationScore: ai.educationScore ?? ai.breakdown?.educationScore,
    atsScore: ai.atsScore ?? ai.breakdown?.atsReadabilityScore,
    overallScore: ai.overallScore ?? ai.totalMatchScore
  };

  const overallValidation = validateOverallScore(aiScores);
  const crossValidation = crossValidateScores(aiScores, deterministicScores);
  const useAIScores = crossValidation.isValid && overallValidation.isValid;

  if (!useAIScores) {
    logger.warn('AI scores failed validation, using deterministic');
    return deterministicScores;
  }

  return {
    overallScore: scoringUtils.sanitizeScore(overallValidation.calculated),
    totalMatchScore: scoringUtils.sanitizeScore(overallValidation.calculated),
    skillsScore: scoringUtils.sanitizeScore(aiScores.skillsScore ?? deterministicScores.skillsScore),
    experienceScore: scoringUtils.sanitizeScore(aiScores.experienceScore ?? deterministicScores.experienceScore),
    educationScore: scoringUtils.sanitizeScore(aiScores.educationScore ?? deterministicScores.educationScore),
    atsScore: scoringUtils.sanitizeScore(aiScores.atsScore ?? deterministicScores.atsScore),
    breakdown: {
      skillsScore: scoringUtils.sanitizeScore(ai.breakdown?.skillsScore ?? aiScores.skillsScore ?? deterministicScores.skillsScore),
      experienceScore: scoringUtils.sanitizeScore(ai.breakdown?.experienceScore ?? aiScores.experienceScore ?? deterministicScores.experienceScore),
      educationScore: scoringUtils.sanitizeScore(ai.breakdown?.educationScore ?? aiScores.educationScore ?? deterministicScores.educationScore),
      atsReadabilityScore: scoringUtils.sanitizeScore(ai.breakdown?.atsReadabilityScore ?? aiScores.atsScore ?? deterministicScores.atsScore)
    },
    reasoning: ai.reasoning || deterministicScores.reasoning,
    matchedSkills: ai.matchedSkills || deterministicScores.matchedSkills || [],
    missingSkills: ai.missingSkills || deterministicScores.missingSkills || [],
    bonusSkills: ai.bonusSkills || deterministicScores.bonusSkills || [],
    candidateExperienceYears: ai.candidateExperienceYears ?? deterministicScores.candidateExperienceYears ?? 0,
    quantifiableAchievements: ai.quantifiableAchievements || deterministicScores.quantifiableAchievements || [],
    atsFormattingFlags: ai.atsFormattingFlags || deterministicScores.atsFormattingFlags || [],
    strengths: ai.strengths || deterministicScores.strengths || [],
    redFlags: ai.redFlags || deterministicScores.redFlags || [],
    summary: ai.summary || deterministicScores.summary || '',
    aiEnhanced: true,
    analysisType: 'comprehensive'
  };
};