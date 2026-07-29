// services/gemini/deterministic/reasoning.js

/**
 * Format years for clean display
 */
const formatYears = (years) => {
  if (!years || years === 0) return 'None';
  if (years < 1) return `${Math.round(years * 12)} months`;
  if (Number.isInteger(years)) return `${years} years`;
  const whole = Math.floor(years);
  const months = Math.round((years - whole) * 12);
  return `${whole}y ${months}m`;
};

export const buildReasoning = (skillsResult, experienceResult, educationResult, atsResult) => {
  const isEntryLevel = experienceResult.requiredYears === 0;
  let reasoning = '';
  
  // === SKILLS ===
  reasoning += `SKILLS ASSESSMENT: `;
  
  if (skillsResult.matchCount === skillsResult.totalRequired) {
    reasoning += `All ${skillsResult.totalRequired} required skills matched perfectly. `;
  } else if (skillsResult.matchCount > 0) {
    reasoning += `${skillsResult.matchCount}/${skillsResult.totalRequired} required skills identified (${skillsResult.percentage}% match). `;
    if (skillsResult.matched.length > 0) {
      reasoning += `Present: ${skillsResult.matched.join(', ')}. `;
    }
    if (skillsResult.missing.length > 0) {
      reasoning += `Missing: ${skillsResult.missing.join(', ')}. `;
    }
  } else {
    reasoning += `None of the ${skillsResult.totalRequired} required skills found. `;
  }
  
  // === EXPERIENCE ===
  reasoning += `EXPERIENCE ASSESSMENT: `;
  
  if (isEntryLevel) {
    // Entry-level position
    reasoning += `Entry-level position - no experience required. `;
    if (experienceResult.candidateYears > 0) {
      reasoning += `Candidate has ${formatYears(experienceResult.candidateYears)} of experience (beneficial bonus). `;
    } else {
      reasoning += `Candidate has no prior experience, suitable for entry-level. `;
    }
  } else {
    // Experience required
    if (experienceResult.candidateYears === 0) {
      reasoning += `No experience detected vs ${experienceResult.requiredYears} ${experienceResult.requiredYears === 1 ? 'year' : 'years'} required. `;
    } else {
      reasoning += `${formatYears(experienceResult.candidateYears)} of experience detected vs ${experienceResult.requiredYears} ${experienceResult.requiredYears === 1 ? 'year' : 'years'} required. `;
      
      if (experienceResult.ratio >= 2.0) {
        reasoning += `More than doubles the requirement. `;
      } else if (experienceResult.ratio >= 1.5) {
        reasoning += `Significantly exceeds requirements. `;
      } else if (experienceResult.ratio >= 1.2) {
        reasoning += `Comfortably exceeds requirements. `;
      } else if (experienceResult.ratio >= 1.0) {
        reasoning += `Meets requirements. `;
      } else if (experienceResult.ratio >= 0.7) {
        reasoning += `Approaching but below requirements. `;
      } else {
        reasoning += `Significant gap below requirements. `;
      }
    }
  }
  
  // === EDUCATION ===
  reasoning += `EDUCATION: `;
  const eduLevel = educationResult.level.charAt(0).toUpperCase() + educationResult.level.slice(1);
  
  if (educationResult.score >= 90) {
    reasoning += `${eduLevel} degree - exceeds typical requirements. `;
  } else if (educationResult.score >= 70) {
    reasoning += `${eduLevel} degree - meets standard requirements. `;
  } else if (educationResult.score >= 50) {
    reasoning += `${eduLevel} level - may not fully meet requirements. `;
  } else {
    reasoning += `Below typical education requirements. `;
  }
  
  // === ATS ===
  reasoning += `ATS: Score ${atsResult.score}/100. `;
  
  if (atsResult.flags.length === 0) {
    reasoning += `No formatting issues detected.`;
  } else if (atsResult.flags.length === 1) {
    reasoning += `1 issue: ${atsResult.flags[0]}.`;
  } else {
    reasoning += `${atsResult.flags.length} issues: ${atsResult.flags.join('; ')}.`;
  }
  
  return reasoning;
};