// services/gemini/deterministic/experienceScore.js

import { textProcessor } from '../../../utils/resumehandlers/textProcessor.js';
import { scoringUtils } from '../../../utils/resumehandlers/scoringUtils.js';

export const calculateExperienceScore = (resumeText, advertisement) => {
  const requiredYears = scoringUtils.extractRequiredExperience(advertisement);
  const candidateYears = textProcessor.extractExperienceYears(resumeText);
  const result = scoringUtils.calculateExperienceScore(candidateYears, requiredYears);
  
  return {
    score: result.score,
    candidateYears,
    requiredYears,
    ratio: parseFloat(result.ratio?.toFixed(2)) || 0,
    level: result.level,
    isEntryLevel: requiredYears === 0
  };
};