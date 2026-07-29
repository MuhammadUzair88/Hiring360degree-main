// services/gemini/deterministic/strengths.js

const formatYears = (years) => {
  if (!years || years === 0) return '0';
  if (years < 1) return 'under 1 year';
  if (Number.isInteger(years)) return `${years}`;
  const whole = Math.floor(years);
  const months = Math.round((years - whole) * 12);
  return `${whole}.${Math.round(months / 12 * 10)}`;
};

export const buildStrengths = (skillsResult, experienceResult, educationResult) => {
  const strengths = [];
  
  // Skills strengths
  if (skillsResult.matchCount === skillsResult.totalRequired) {
    strengths.push(`Complete skills match - all ${skillsResult.totalRequired} required skills demonstrated`);
  } else if (skillsResult.matchCount >= skillsResult.totalRequired * 0.8) {
    strengths.push(`Strong skills alignment with ${skillsResult.matchCount} of ${skillsResult.totalRequired} required skills`);
  } else if (skillsResult.matchCount >= skillsResult.totalRequired * 0.6) {
    strengths.push(`Moderate skills coverage with ${skillsResult.matchCount} of ${skillsResult.totalRequired} skills present`);
  } else if (skillsResult.matchCount > 0) {
    strengths.push(`Some relevant skills identified (${skillsResult.matchCount} of ${skillsResult.totalRequired})`);
  }
  
  // Experience strengths
  const expYears = experienceResult.candidateYears;
  
  if (expYears >= 10) {
    strengths.push(`Extensive professional background with ${expYears}+ years of experience`);
  } else if (expYears >= 5) {
    strengths.push(`Solid professional experience of ${expYears} years`);
  } else if (expYears >= 3) {
    strengths.push(`Established professional with ${expYears} years of experience`);
  } else if (expYears >= 2) {
    strengths.push(`Professional experience of ${expYears} years`);
  } else if (expYears >= 1) {
    strengths.push(`Entry to mid-level professional (${expYears} ${expYears === 1 ? 'year' : 'years'})`);
  } else if (expYears > 0) {
    strengths.push(`Early career professional with ${formatYears(expYears)} of experience`);
  }
  
  if (experienceResult.ratio >= 1.5 && expYears > 0) {
    strengths.push(`Experience significantly exceeds the requirement`);
  } else if (experienceResult.ratio >= 1.0 && expYears > 0) {
    strengths.push(`Experience meets the position requirement`);
  }
  
  // Education strengths
  if (educationResult.score >= 90) {
    strengths.push(`Advanced ${educationResult.level} degree provides strong academic foundation`);
  } else if (educationResult.score >= 80) {
    strengths.push(`Solid educational background with ${educationResult.level} level qualification`);
  } else if (educationResult.score >= 60) {
    strengths.push(`Adequate educational foundation at ${educationResult.level} level`);
  }
  
  return strengths;
};