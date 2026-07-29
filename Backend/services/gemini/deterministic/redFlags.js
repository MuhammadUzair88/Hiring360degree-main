// services/gemini/deterministic/redFlags.js

export const buildRedFlags = (skillsResult, experienceResult, atsResult) => {
  const flags = [];
  
  if (skillsResult.matchCount === 0) {
    flags.push('CRITICAL: No required skills matched');
  } else if (skillsResult.matchCount < skillsResult.totalRequired * 0.3) {
    flags.push(`Significant skills gap: only ${skillsResult.matchCount}/${skillsResult.totalRequired} required skills present`);
  }
  
  if (experienceResult.ratio < 0.3) {
    flags.push(`Critical experience gap: ${experienceResult.candidateYears} yrs vs ${experienceResult.requiredYears} required`);
  } else if (experienceResult.ratio < 0.5) {
    flags.push(`Notable experience shortfall: ${experienceResult.candidateYears} yrs (${experienceResult.requiredYears} required)`);
  }
  
  if (skillsResult.matchCount < skillsResult.totalRequired * 0.4 && experienceResult.ratio < 0.5) {
    flags.push('Combined skills and experience gaps suggest poor fit');
  }
  
  if (atsResult.score < 30) {
    flags.push('Severe ATS compatibility issues');
  }
  
  return flags;
};