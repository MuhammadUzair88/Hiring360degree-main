// services/gemini/deterministic/atsScore.js

export const calculateATSScore = (resumeText) => {
  let score = 100;
  const flags = [];
  const lowerText = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;

  // === SECTION COMPLETENESS (flexible scoring) ===
  
  // Contact section
  const hasContact = lowerText.match(/email|phone|contact|address|linkedin/i);
  if (!hasContact) {
    score -= Math.floor(Math.random() * 5) + 8; // 8-12 points
    flags.push('Missing contact information section');
  }
  
  // Summary section
  const hasSummary = lowerText.match(/summary|objective|profile|about\s*me/i);
  if (!hasSummary) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Missing professional summary/objective');
  }
  
  // Experience section
  const hasExperience = lowerText.match(/experience|work|employment|career/i);
  if (!hasExperience) {
    score -= Math.floor(Math.random() * 6) + 12; // 12-17 points
    flags.push('Missing work experience section');
  }
  
  // Education section
  const hasEducation = lowerText.match(/education|university|college|degree|academic/i);
  if (!hasEducation) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Missing education section');
  }
  
  // Skills section
  const hasSkills = lowerText.match(/skills|technologies|competencies|expertise|proficiencies/i);
  if (!hasSkills) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Missing dedicated skills section');
  }

  // === FORMATTING & READABILITY (flexible scoring) ===
  
  // Tables/columns
  if (lowerText.match(/table|column|text\.box|cell/i)) {
    score -= Math.floor(Math.random() * 6) + 10; // 10-15 points
    flags.push('Uses tables or columns that ATS may not parse correctly');
  }
  
  // Images/graphics
  if (lowerText.match(/image|graphic|chart|icon|logo|photo/i)) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Contains images or graphics that ATS cannot read');
  }
  
  // Headers/footers
  if (lowerText.match(/header|footer/i)) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Important info may be in headers/footers that ATS skips');
  }
  
  // Wall of text detection
  const paragraphs = resumeText.split(/\n\n+/);
  const hasWallOfText = paragraphs.some(p => p.length > 500 && !p.match(/[•\-*]/));
  if (hasWallOfText) {
    score -= Math.floor(Math.random() * 4) + 7; // 7-10 points
    flags.push('Contains walls of text without bullet points');
  }
  
  // Resume length scoring
  if (wordCount < 100) {
    score -= Math.floor(Math.random() * 5) + 10; // 10-14 points
    flags.push('Resume too short - lacks sufficient detail');
  } else if (wordCount < 200) {
    score -= Math.floor(Math.random() * 3) + 5; // 5-7 points
    flags.push('Resume is brief - consider adding more detail');
  } else if (wordCount > 5000) {
    score -= Math.floor(Math.random() * 2) + 3; // 3-4 points
    flags.push('Resume very long - may exceed ATS parsing limits');
  }

  // === KEYWORD OPTIMIZATION (flexible scoring) ===
  
  const actionVerbs = /(?:managed|led|developed|created|implemented|designed|built|launched|increased|decreased|improved|reduced|achieved|delivered|generated|optimized|architected|engineered|orchestrated|spearheaded|pioneered|transformed|streamlined|automated|scaled|mentored|coached|trained|supervised|directed|headed|founded|established)/gi;
  const actionVerbCount = (resumeText.match(actionVerbs) || []).length;
  
  if (actionVerbCount < 3) {
    score -= Math.floor(Math.random() * 5) + 10; // 10-14 points
    flags.push('Very low use of action verbs');
  } else if (actionVerbCount < 5) {
    score -= Math.floor(Math.random() * 3) + 5; // 5-7 points
    flags.push('Low use of action verbs');
  } else if (actionVerbCount < 8) {
    score -= Math.floor(Math.random() * 2) + 2; // 2-3 points
    flags.push('Below average use of action verbs');
  }

  // === ACHIEVEMENTS & METRICS (flexible scoring) ===
  
  const metricsPattern = /\d+%|\$\d+|\d+\s*(?:people|team|users|customers|clients|employees|staff|members|developers|engineers|projects|applications|platforms)/gi;
  const metricsCount = (resumeText.match(metricsPattern) || []).length;
  
  if (metricsCount === 0) {
    score -= Math.floor(Math.random() * 6) + 14; // 14-19 points
    flags.push('No quantifiable achievements or metrics found');
  } else if (metricsCount < 2) {
    score -= Math.floor(Math.random() * 4) + 8; // 8-11 points
    flags.push('Very few quantifiable achievements');
  } else if (metricsCount < 4) {
    score -= Math.floor(Math.random() * 3) + 4; // 4-6 points
    flags.push('Few quantifiable achievements - could be stronger');
  }

  // === BONUS POINTS ===
  
  // Good bullet point usage
  const bulletCount = (resumeText.match(/[•\-*•●○]/g) || []).length;
  if (bulletCount > 10) {
    score += Math.floor(Math.random() * 3) + 2; // +2-4 points
  }
  
  // Good action verb density
  if (actionVerbCount > 15) {
    score += Math.floor(Math.random() * 3) + 2; // +2-4 points
  }
  
  // Strong metrics presence
  if (metricsCount > 5) {
    score += Math.floor(Math.random() * 4) + 3; // +3-6 points
  }

  // Ensure score stays in 0-100 range
  score = Math.max(5, Math.min(98, score));
  
  // Round to whole number for clean display
  score = Math.round(score);
  
  return {
    score,
    flags,
    deductions: 100 - score
  };
};