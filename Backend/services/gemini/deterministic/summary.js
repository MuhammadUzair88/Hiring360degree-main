// services/gemini/deterministic/summary.js

/**
 * Format years for display - clean, human-readable
 */
const formatYears = (years) => {
  if (!years || years === 0) return 'No experience';
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  if (Number.isInteger(years) || years % 1 === 0) {
    const y = Math.round(years);
    return `${y} ${y === 1 ? 'year' : 'years'}`;
  }
  const whole = Math.floor(years);
  const months = Math.round((years - whole) * 12);
  if (months === 0) return `${whole} ${whole === 1 ? 'year' : 'years'}`;
  return `${whole} year${whole > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
};

export const buildSummary = (skillsResult, experienceResult, educationResult, atsResult) => {
  const matchRate = skillsResult.totalRequired > 0 
    ? Math.round((skillsResult.matchCount / skillsResult.totalRequired) * 100) 
    : 0;
  
  const isEntryLevel = experienceResult.requiredYears === 0;
  let assessment = '';
  
  // === OVERALL ASSESSMENT ===
  if (matchRate >= 80 && experienceResult.score >= 85) {
    assessment = 'Exceptional candidate with strong qualifications. ';
  } else if (matchRate >= 60 && experienceResult.score >= 70) {
    assessment = 'Solid candidate meeting most core requirements. ';
  } else if (matchRate >= 40 && experienceResult.score >= 50) {
    assessment = 'Candidate partially meets requirements with some gaps. ';
  } else if (matchRate < 40 || experienceResult.score < 40) {
    assessment = 'Candidate falls below requirements for this position. ';
  } else {
    assessment = 'Candidate shows mixed alignment with position requirements. ';
  }
  
  // === SKILLS ===
  if (skillsResult.matchCount === skillsResult.totalRequired) {
    assessment += `Demonstrates all ${skillsResult.totalRequired} required skills. `;
  } else if (skillsResult.matchCount >= skillsResult.totalRequired * 0.7) {
    assessment += `Possesses ${skillsResult.matchCount} of ${skillsResult.totalRequired} required skills`;
    if (skillsResult.missing.length > 0) {
      assessment += `, with gaps in ${skillsResult.missing.slice(0, 2).join(' and ')}`;
    }
    assessment += '. ';
  } else if (skillsResult.matchCount > 0) {
    assessment += `Only ${skillsResult.matchCount} of ${skillsResult.totalRequired} required skills present`;
    if (skillsResult.missing.length > 0) {
      assessment += ` - missing ${skillsResult.missing.slice(0, 3).join(', ')}`;
    }
    assessment += '. ';
  } else {
    assessment += `None of the ${skillsResult.totalRequired} required skills were found. `;
  }
  
  // === EXPERIENCE (Handle entry-level vs experienced) ===
  if (isEntryLevel) {
    // Entry-level position
    assessment += 'Position does not require prior experience. ';
    if (experienceResult.candidateYears > 0) {
      assessment += `Candidate brings ${formatYears(experienceResult.candidateYears)} of experience as a bonus. `;
    } else {
      assessment += 'Candidate is suitable for this entry-level role. ';
    }
  } else {
    // Experience required
    if (experienceResult.candidateYears <= 0) {
      assessment += 'No professional experience detected, falling short of requirements. ';
    } else {
      assessment += `${formatYears(experienceResult.candidateYears)} of professional experience`;
      
      if (experienceResult.ratio >= 1.5) {
        assessment += ' significantly exceeds the requirement';
      } else if (experienceResult.ratio >= 1.2) {
        assessment += ' exceeds the requirement';
      } else if (experienceResult.ratio >= 1.0) {
        assessment += ' meets the requirement';
      } else if (experienceResult.ratio >= 0.7) {
        assessment += ' approaches but falls below the requirement';
      } else {
        assessment += ' falls well below the requirement';
      }
      assessment += '. ';
    }
  }
  
  // === EDUCATION ===
  const eduLevel = educationResult.level.charAt(0).toUpperCase() + educationResult.level.slice(1);
  if (educationResult.score >= 90) {
    assessment += `${eduLevel}-level education provides excellent foundation. `;
  } else if (educationResult.score >= 70) {
    assessment += `${eduLevel}-level education is appropriate. `;
  } else if (educationResult.score >= 50) {
    assessment += `${eduLevel}-level education partially meets requirements. `;
  } else {
    assessment += 'Education level may not meet expectations. ';
  }
  
  // === ATS ===
  if (atsResult.score >= 90) {
    assessment += 'Resume is excellently formatted for ATS systems.';
  } else if (atsResult.score >= 70) {
    assessment += `Resume is adequately formatted with ${atsResult.flags.length} minor considerations.`;
  } else if (atsResult.score >= 50) {
    assessment += `Resume has ${atsResult.flags.length} formatting issues that may affect ATS.`;
  } else {
    assessment += `Resume has significant formatting issues (${atsResult.flags.length}) affecting ATS parsing.`;
  }
  
  return assessment;
};