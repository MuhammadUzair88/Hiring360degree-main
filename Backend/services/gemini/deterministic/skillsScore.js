// services/gemini/deterministic/skillsScore.js

import { textProcessor } from '../../../utils/resumehandlers/textProcessor.js';
import { scoringUtils } from '../../../utils/resumehandlers/scoringUtils.js';

export const calculateSkillsScore = (resumeText, advertisement) => {
  const extractedSkills = textProcessor.extractSkills(resumeText);
  const requiredSkills = advertisement.skills || [];
  const result = scoringUtils.calculateSkillsScore(extractedSkills, requiredSkills);
  
  // Get the raw score - this is already flexible from scoringUtils
  // scoringUtils.calculateSkillsScore returns precise percentages like 67%, 83%, etc.
  
  return {
    score: result.score, // This will be like 67, 83, 91 - not just 20, 40, 60
    matched: result.details?.filter(d => d.matched).map(d => d.skill) || [],
    missing: result.details?.filter(d => !d.matched).map(d => d.skill) || [],
    matchCount: result.matchCount,
    totalRequired: result.totalRequired,
    percentage: result.percentage
  };
};