// services/gemini/validator.js

import { scoringUtils } from '../../utils/resumehandlers/scoringUtils.js';
import { THRESHOLDS } from '../../config/constants.js';

export const crossValidateScores = (aiScores, deterministicScores) => {
  const validations = [];
  let trustScore = 1.0;

  const scoreChecks = [
    { ai: aiScores.skillsScore, det: deterministicScores.skillsScore, label: 'Skills' },
    { ai: aiScores.experienceScore, det: deterministicScores.experienceScore, label: 'Experience' },
    { ai: aiScores.educationScore, det: deterministicScores.educationScore, label: 'Education' },
    { ai: aiScores.atsScore, det: deterministicScores.atsScore, label: 'ATS' },
  ];

  for (const check of scoreChecks) {
    const deviation = Math.abs((check.ai || 0) - (check.det || 0));
    if (deviation > 25) {
      validations.push({ ...check, deviation, status: 'FAIL' });
      trustScore *= 0.7;
    } else if (deviation > 15) {
      validations.push({ ...check, deviation, status: 'WARN' });
      trustScore *= 0.9;
    } else {
      validations.push({ ...check, deviation, status: 'PASS' });
    }
  }

  return {
    isValid: validations.every(v => v.status !== 'FAIL'),
    trustScore: parseFloat(trustScore.toFixed(2)),
    validations
  };
};

export const validateOverallScore = (scores) => {
  const calculated = scoringUtils.calculateOverallScore({
    skills: scores.skillsScore,
    experience: scores.experienceScore,
    education: scores.educationScore,
    ats: scores.atsScore
  });
  
  return {
    calculated,
    reported: scores.overallScore,
    deviation: Math.abs((scores.overallScore || 0) - calculated),
    isValid: Math.abs((scores.overallScore || 0) - calculated) <= THRESHOLDS.MAX_SCORE_DEVIATION
  };
};