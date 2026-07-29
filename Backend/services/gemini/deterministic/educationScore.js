// services/gemini/deterministic/educationScore.js

import { textProcessor } from '../../../utils/resumehandlers/textProcessor.js';

export const calculateEducationScore = (resumeText) => {
  const result = textProcessor.evaluateEducation(resumeText);
  
  // Add some flexibility based on additional factors
  let score = result.score;
  const lowerText = resumeText.toLowerCase();
  
  // Check for relevant certifications (bonus)
  const certCount = (lowerText.match(/certification|certificate|credential|licensed/i) || []).length;
  if (certCount > 2) {
    score += Math.floor(Math.random() * 5) + 3; // +3-7 for multiple certs
  } else if (certCount > 0) {
    score += Math.floor(Math.random() * 3) + 1; // +1-3 for having certs
  }
  
  // Check for continuing education
  if (lowerText.match(/workshop|training|course|bootcamp|seminar|conference/i)) {
    score += Math.floor(Math.random() * 3) + 1; // +1-3
  }
  
  // Check for relevant projects
  if (lowerText.match(/project|portfolio|github|gitlab/i)) {
    score += Math.floor(Math.random() * 3) + 1; // +1-3
  }
  
  // Cap at 100
  score = Math.min(100, Math.round(score));
  
  return {
    score,
    level: result.level
  };
};