// services/geminiService.js

import { THRESHOLDS } from '../config/constants.js';
import { piiSanitizer } from '../utils/resumehandlers/piiSanitizer.js';
import { textProcessor } from '../utils/resumehandlers/textProcessor.js';
import { scoringUtils } from '../utils/resumehandlers/scoringUtils.js';
import { ModelFallbackService } from './modelFallbackService.js';
import { apiKeyManager } from './apiKeyManager.js';
import { ANALYSIS_PROMPTS } from '../utils/resumehandlers/analysisPrompts.js';
import { logger } from '../utils/resumehandlers/logger.js';

// ============================================
// CACHE MODULE
// ============================================
class LRUCache {
  constructor(maxSize = THRESHOLDS.MAX_CACHE_SIZE) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.maxSize) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  clear() { this.cache.clear(); }
  get size() { return this.cache.size; }
}

const analysisCache = new LRUCache();

// ============================================
// USAGE TRACKER MODULE
// ============================================
const usageTracker = {
  requestsThisMinute: 0,
  requestsToday: 0,
  lastMinuteReset: Date.now(),
  lastDayReset: Date.now(),
  
  canMakeRequest() {
    const now = Date.now();
    if (now - this.lastMinuteReset > 60000) {
      this.requestsThisMinute = 0;
      this.lastMinuteReset = now;
    }
    if (now - this.lastDayReset > 86400000) {
      this.requestsToday = 0;
      this.lastDayReset = now;
    }
    if (this.requestsThisMinute >= 4) return false;
    if (this.requestsToday >= 1400) return false;
    return true;
  },
  
  recordRequest() {
    this.requestsThisMinute++;
    this.requestsToday++;
  }
};

// ============================================
// FALLBACK SERVICE MODULE
// ============================================
let fallbackService = null;

const initializeFallbackService = () => {
  if (!fallbackService && apiKeyManager.getActiveKeyCount() > 0) {
    fallbackService = new ModelFallbackService();
    logger.info('Model fallback service initialized');
  }
  return fallbackService;
};

// ============================================
// SCHEMA BUILDER MODULE
// ============================================
const buildAnalysisSchema = () => ({
  type: "object",
  properties: {
    overallScore: { type: "integer", minimum: 0, maximum: 100 },
    totalMatchScore: { type: "integer", minimum: 0, maximum: 100 },
    skillsScore: { type: "integer", minimum: 0, maximum: 100 },
    experienceScore: { type: "integer", minimum: 0, maximum: 100 },
    educationScore: { type: "integer", minimum: 0, maximum: 100 },
    atsScore: { type: "integer", minimum: 0, maximum: 100 },
    breakdown: {
      type: "object",
      properties: {
        skillsScore: { type: "integer" },
        experienceScore: { type: "integer" },
        educationScore: { type: "integer" },
        atsReadabilityScore: { type: "integer" }
      },
      required: ["skillsScore", "experienceScore", "educationScore", "atsReadabilityScore"]
    },
    reasoning: { type: "string" },
    matchedSkills: { type: "array", items: { type: "string" } },
    missingSkills: { type: "array", items: { type: "string" } },
    bonusSkills: { type: "array", items: { type: "string" } },
    candidateExperienceYears: { type: "number" },
    quantifiableAchievements: { type: "array", items: { type: "string" } },
    atsFormattingFlags: { type: "array", items: { type: "string" } },
    strengths: { type: "array", items: { type: "string" } },
    redFlags: { type: "array", items: { type: "string" } },
    summary: { type: "string" }
  },
  required: ["overallScore", "skillsScore", "experienceScore", "educationScore", "atsScore", "summary"]
});

// ============================================
// AI ANALYSIS MODULE
// ============================================
const getAIAnalysis = async (resumeText, advertisement) => {
  const service = initializeFallbackService();
  if (!service) throw new Error('No fallback service available');

  const prompt = ANALYSIS_PROMPTS.buildAnalysisPrompt(resumeText, advertisement);
  const schema = buildAnalysisSchema();

  return await service.executeWithFallback(prompt, schema);
};

// ============================================
// DETERMINISTIC SCORING MODULE
// ============================================

/**
 * Calculate deterministic scores without AI
 */
const calculateDeterministicScores = (resumeText, advertisement) => {
  const skillsResult = calculateSkillsScore(resumeText, advertisement);
  const experienceResult = calculateExperienceScore(resumeText, advertisement);
  const educationResult = calculateEducationScore(resumeText);
  const atsResult = calculateATSScore(resumeText);
  
  const overallScore = scoringUtils.calculateOverallScore({
    skills: skillsResult.score,
    experience: experienceResult.score,
    education: educationResult.score,
    ats: atsResult.score
  });

  return {
    overallScore,
    totalMatchScore: overallScore,
    skillsScore: skillsResult.score,
    experienceScore: experienceResult.score,
    educationScore: educationResult.score,
    atsScore: atsResult.score,
    breakdown: {
      skillsScore: skillsResult.score,
      experienceScore: experienceResult.score,
      educationScore: educationResult.score,
      atsReadabilityScore: atsResult.score
    },
    reasoning: buildReasoning(skillsResult, experienceResult, educationResult, atsResult),
    matchedSkills: skillsResult.matched || [],
    missingSkills: skillsResult.missing || [],
    bonusSkills: [],
    candidateExperienceYears: experienceResult.candidateYears,
    quantifiableAchievements: extractAchievements(resumeText),
    atsFormattingFlags: atsResult.flags,
    strengths: buildStrengths(skillsResult, experienceResult, educationResult),
    redFlags: buildRedFlags(skillsResult, experienceResult, atsResult),
    summary: buildSummary(skillsResult, experienceResult, educationResult, atsResult),
    aiEnhanced: false,
    analysisType: 'deterministic'
  };
};

/**
 * Calculate skills score
 */
const calculateSkillsScore = (resumeText, advertisement) => {
  const extractedSkills = textProcessor.extractSkills(resumeText);
  const requiredSkills = advertisement.skills || [];
  const result = scoringUtils.calculateSkillsScore(extractedSkills, requiredSkills);
  
  return {
    score: result.score,
    matched: result.details?.filter(d => d.matched).map(d => d.skill) || [],
    missing: result.details?.filter(d => !d.matched).map(d => d.skill) || [],
    matchCount: result.matchCount,
    totalRequired: result.totalRequired,
    percentage: result.percentage
  };
};

/**
 * Calculate experience score
 */
const calculateExperienceScore = (resumeText, advertisement) => {
  const requiredYears = scoringUtils.extractRequiredExperience(advertisement);
  const candidateYears = textProcessor.extractExperienceYears(resumeText);
  const result = scoringUtils.calculateExperienceScore(candidateYears, requiredYears);
  
  return {
    score: result.score,
    candidateYears,
    requiredYears,
    ratio: result.ratio,
    level: result.level
  };
};

/**
 * Calculate education score
 */
const calculateEducationScore = (resumeText) => {
  const result = textProcessor.evaluateEducation(resumeText);
  
  return {
    score: result.score,
    level: result.level
  };
};

/**
 * Calculate ATS score based on detailed criteria
 */
const calculateATSScore = (resumeText) => {
  let deductions = 0;
  const flags = [];
  const lowerText = resumeText.toLowerCase();

  // SECTION COMPLETENESS (up to 40 points deduction)
  if (!lowerText.match(/email|phone|contact|address|linkedin/i)) {
    deductions += 10;
    flags.push('Missing contact information section');
  }
  if (!lowerText.match(/summary|objective|profile|about\s*me/i)) {
    deductions += 10;
    flags.push('Missing professional summary/objective');
  }
  if (!lowerText.match(/experience|work|employment|career/i)) {
    deductions += 15;
    flags.push('Missing work experience section');
  }
  if (!lowerText.match(/education|university|college|degree|academic/i)) {
    deductions += 10;
    flags.push('Missing education section');
  }
  if (!lowerText.match(/skills|technologies|competencies|expertise|proficiencies/i)) {
    deductions += 10;
    flags.push('Missing dedicated skills section');
  }

  // FORMATTING & READABILITY (up to 30 points deduction)
  if (lowerText.match(/table|column|text.box|cell/i)) {
    deductions += 15;
    flags.push('Uses tables or columns that ATS may not parse correctly');
  }
  if (lowerText.match(/image|graphic|chart|icon|logo|photo/i)) {
    deductions += 10;
    flags.push('Contains images or graphics that ATS cannot read');
  }
  if (lowerText.match(/header|footer/i)) {
    deductions += 10;
    flags.push('Important info may be in headers/footers that ATS skips');
  }
  
  // Check for walls of text (paragraphs > 500 chars without breaks)
  const paragraphs = resumeText.split(/\n\n+/);
  const hasWallOfText = paragraphs.some(p => p.length > 500 && !p.match(/[•\-*]/));
  if (hasWallOfText) {
    deductions += 10;
    flags.push('Contains walls of text without bullet points');
  }
  
  // Check resume length
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 200) {
    deductions += 10;
    flags.push('Resume too short - lacks sufficient detail for ATS parsing');
  } else if (wordCount > 5000) {
    deductions += 5;
    flags.push('Resume very long - may exceed ATS parsing limits');
  }

  // KEYWORD OPTIMIZATION (up to 20 points deduction)
  const actionVerbs = /(?:managed|led|developed|created|implemented|designed|built|launched|increased|decreased|improved|reduced|achieved|delivered|generated|optimized)/gi;
  const actionVerbCount = (resumeText.match(actionVerbs) || []).length;
  if (actionVerbCount < 5) {
    deductions += 10;
    flags.push('Low use of action verbs - may not pass ATS keyword filters');
  }
  if (actionVerbCount < 10 && actionVerbCount >= 5) {
    deductions += 5;
    flags.push('Below average use of action verbs');
  }

  // ACHIEVEMENTS & METRICS (up to 20 points deduction)
  const metricsPattern = /\d+%|\$\d+|\d+\s*(?:people|team|users|customers|clients|employees|staff|members|developers|engineers)/gi;
  const metricsCount = (resumeText.match(metricsPattern) || []).length;
  if (metricsCount === 0) {
    deductions += 20;
    flags.push('No quantifiable achievements or metrics found');
  } else if (metricsCount < 3) {
    deductions += 10;
    flags.push('Few quantifiable achievements - add more metrics');
  }

  // Calculate final score
  const score = Math.max(0, Math.min(100, 100 - deductions));
  
  return {
    score,
    flags,
    deductions,
    maxDeductions: 100
  };
};

/**
 * Extract quantifiable achievements
 */
const extractAchievements = (text) => {
  const achievements = [];
  const patterns = [
    /(?:increased|decreased|improved|reduced|boosted|enhanced|optimized|streamlined|automated|saved|generated|grew|scaled)[^.!]*?(?:\d+%|\d+\s*percent)[^.!]*/gi,
    /(?:managed|budget|revenue|sales|saved|generated|worth|valued)[^.!]*?\$\s*\d+[^.!]*/gi,
    /(?:led|managed|mentored|trained|supervised|headed|directed)[^.!]*?(?:\d+\s*(?:people|team|developers|engineers|staff|members|employees))[^.!]*/gi,
    /(?:reduced|decreased|improved|shortened|accelerated|sped up)[^.!]*?(?:by\s*\d+\s*(?:days|weeks|months|hours|minutes)|from\s*\d+\s*(?:days|weeks|months)[^.!]*to\s*\d+)[^.!]*/gi,
    /(?:served|supported|handled|processed|managed|delivered)[^.!]*?\d+[^.!]*(?:users|customers|clients|requests|transactions|projects)[^.!]*/gi
  ];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) achievements.push(...matches.map(m => m.trim()));
  }
  return [...new Set(achievements)].slice(0, 5);
};

/**
 * Build reasoning string
 */
const buildReasoning = (skillsResult, experienceResult, educationResult, atsResult) => {
  let reasoning = '';
  
  // Skills analysis
  reasoning += `SKILLS ASSESSMENT: `;
  reasoning += `Candidate matches ${skillsResult.matchCount} out of ${skillsResult.totalRequired} required skills (${skillsResult.percentage}% match rate). `;
  if (skillsResult.matched.length > 0) {
    reasoning += `Matched skills include: ${skillsResult.matched.join(', ')}. `;
  }
  if (skillsResult.missing.length > 0) {
    reasoning += `Critical gaps identified in: ${skillsResult.missing.join(', ')}. `;
  }
  
  // Experience analysis
  reasoning += `EXPERIENCE ASSESSMENT: `;
  reasoning += `Detected ${experienceResult.candidateYears} years of experience versus ${experienceResult.requiredYears} years required (ratio: ${experienceResult.ratio}). `;
  if (experienceResult.ratio >= 1.5) {
    reasoning += `Experience significantly exceeds position requirements. `;
  } else if (experienceResult.ratio >= 1.0) {
    reasoning += `Experience meets or exceeds position requirements. `;
  } else if (experienceResult.ratio >= 0.7) {
    reasoning += `Experience is approaching but below requirements. `;
  } else {
    reasoning += `Significant experience gap identified. `;
  }
  
  // Education analysis
  reasoning += `EDUCATION ASSESSMENT: `;
  reasoning += `${educationResult.level.charAt(0).toUpperCase() + educationResult.level.slice(1)}-level education detected (score: ${educationResult.score}%). `;
  if (educationResult.score >= 80) {
    reasoning += `Education level is appropriate for this role. `;
  } else {
    reasoning += `Education level may be below role expectations. `;
  }
  
  // ATS analysis
  reasoning += `ATS COMPATIBILITY: `;
  reasoning += `Score ${atsResult.score}/100. `;
  if (atsResult.flags.length > 0) {
    reasoning += `${atsResult.flags.length} formatting issues detected: ${atsResult.flags.join('; ')}. `;
  } else {
    reasoning += `No significant formatting issues detected. `;
  }
  reasoning += `${atsResult.deductions} points deducted from maximum.`;
  
  return reasoning;
};


/**
 * Build strengths array
 */
const buildStrengths = (skillsResult, experienceResult, educationResult) => {
  const strengths = [];
  
  if (skillsResult.matchCount >= skillsResult.totalRequired * 0.8) {
    strengths.push(`Strong skills alignment: ${skillsResult.matchCount}/${skillsResult.totalRequired} required skills demonstrated`);
  } else if (skillsResult.matchCount >= skillsResult.totalRequired * 0.5) {
    strengths.push(`Moderate skills coverage: ${skillsResult.matchCount}/${skillsResult.totalRequired} required skills present`);
  }
  
  if (experienceResult.ratio >= 1.5) {
    strengths.push(`Significantly exceeds experience requirements with ${experienceResult.candidateYears} years (${experienceResult.requiredYears} required)`);
  } else if (experienceResult.ratio >= 1.0) {
    strengths.push(`Meets experience requirements with ${experienceResult.candidateYears} years of professional background`);
  } else if (experienceResult.ratio >= 0.7) {
    strengths.push(`Approaching experience requirements with ${experienceResult.candidateYears} years`);
  }
  
  if (educationResult.score >= 90) {
    strengths.push(`Advanced education credentials (${educationResult.level} level)`);
  } else if (educationResult.score >= 70) {
    strengths.push(`Adequate educational foundation (${educationResult.level} level)`);
  }
  
  return strengths;
};

/**
 * Build red flags array
 */
const buildRedFlags = (skillsResult, experienceResult, atsResult) => {
  const flags = [];
  
  if (skillsResult.matchCount === 0) {
    flags.push('CRITICAL: No required skills matched - candidate is not qualified for this position');
  } else if (skillsResult.matchCount < skillsResult.totalRequired * 0.3) {
    flags.push(`Significant skills gap: only ${skillsResult.matchCount}/${skillsResult.totalRequired} required skills present`);
  }
  
  if (experienceResult.ratio < 0.3) {
    flags.push(`Critical experience gap: ${experienceResult.candidateYears} years vs ${experienceResult.requiredYears} required`);
  } else if (experienceResult.ratio < 0.5) {
    flags.push(`Notable experience shortfall: ${experienceResult.candidateYears} years (${experienceResult.requiredYears} required)`);
  }
  
  if (skillsResult.matchCount < skillsResult.totalRequired * 0.4 && experienceResult.ratio < 0.5) {
    flags.push('Candidate may not be suitable for this role due to combined skills and experience gaps');
  }
  
  if (atsResult.score < 30) {
    flags.push('Resume has severe ATS compatibility issues that may prevent proper parsing');
  }
  
  return flags;
};

/**
 * Build summary string
 */
const buildSummary = (skillsResult, experienceResult, educationResult, atsResult) => {
  const matchRate = skillsResult.totalRequired > 0 
    ? Math.round((skillsResult.matchCount / skillsResult.totalRequired) * 100) 
    : 0;
  
  let assessment = '';
  
  // Overall assessment
  if (matchRate >= 80 && experienceResult.ratio >= 1.0) {
    assessment = 'Strong candidate with excellent qualifications alignment. ';
  } else if (matchRate >= 60 && experienceResult.ratio >= 0.7) {
    assessment = 'Solid candidate meeting most core requirements. ';
  } else if (matchRate >= 40) {
    assessment = 'Candidate partially meets requirements with notable gaps. ';
  } else {
    assessment = 'Candidate does not meet minimum requirements for this role. ';
  }
  
  // Skills detail
  assessment += `Possesses ${skillsResult.matchCount} of ${skillsResult.totalRequired} required skills`;
  if (skillsResult.missing.length > 0) {
    assessment += ` (missing: ${skillsResult.missing.slice(0, 3).join(', ')})`;
  }
  assessment += '. ';
  
  // Experience detail
  assessment += `${experienceResult.candidateYears} years of professional experience`;
  if (experienceResult.ratio >= 1.2) {
    assessment += ', exceeding the requirement';
  } else if (experienceResult.ratio >= 1.0) {
    assessment += ', meeting the requirement';
  } else {
    assessment += `, below the ${experienceResult.requiredYears}-year requirement`;
  }
  assessment += '. ';
  
  // Education detail
  assessment += `${educationResult.level.charAt(0).toUpperCase() + educationResult.level.slice(1)}-level education`;
  if (educationResult.score >= 80) {
    assessment += ' aligns well with role expectations';
  } else if (educationResult.score >= 60) {
    assessment += ' partially meets education expectations';
  } else {
    assessment += ' may not meet education requirements';
  }
  assessment += '. ';
  
  // ATS detail
  if (atsResult.score >= 80) {
    assessment += 'Resume is well-formatted for ATS parsing.';
  } else if (atsResult.score >= 50) {
    assessment += `Resume has ${atsResult.flags.length} formatting issues that may affect ATS performance.`;
  } else {
    assessment += 'Resume has significant formatting issues that will likely impact ATS parsing.';
  }
  
  return assessment;
};


// ============================================
// SCORE VALIDATION MODULE
// ============================================

/**
 * Cross-validate AI scores against deterministic calculations
 */
const crossValidateScores = (aiScores, deterministicScores) => {
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
      validations.push({ metric: check.label, aiScore: check.ai, detScore: check.det, deviation, status: 'FAIL' });
      trustScore *= 0.7;
    } else if (deviation > 15) {
      validations.push({ metric: check.label, aiScore: check.ai, detScore: check.det, deviation, status: 'WARN' });
      trustScore *= 0.9;
    } else {
      validations.push({ metric: check.label, aiScore: check.ai, detScore: check.det, deviation, status: 'PASS' });
    }
  }

  return {
    isValid: validations.every(v => v.status !== 'FAIL'),
    trustScore: parseFloat(trustScore.toFixed(2)),
    validations
  };
};

/**
 * Validate the weighted overall score
 */
const validateOverallScore = (scores) => {
  const calculated = scoringUtils.calculateOverallScore({
    skills: scores.skillsScore,
    experience: scores.experienceScore,
    education: scores.educationScore,
    ats: scores.atsScore
  });
  
  const deviation = Math.abs((scores.overallScore || 0) - calculated);
  
  return {
    calculated,
    reported: scores.overallScore,
    deviation,
    isValid: deviation <= THRESHOLDS.MAX_SCORE_DEVIATION
  };
};

// ============================================
// SCORE MERGING MODULE
// ============================================

/**
 * Merge AI results with deterministic scores
 */
const mergeScores = (aiResult, deterministicScores) => {
  if (!aiResult?.parsed) {
    logger.info('Using deterministic scores (no AI result)');
    return deterministicScores;
  }

  const ai = aiResult.parsed;
  
  // Extract AI scores
  const aiScores = {
    skillsScore: ai.skillsScore ?? ai.breakdown?.skillsScore,
    experienceScore: ai.experienceScore ?? ai.breakdown?.experienceScore,
    educationScore: ai.educationScore ?? ai.breakdown?.educationScore,
    atsScore: ai.atsScore ?? ai.breakdown?.atsReadabilityScore,
    overallScore: ai.overallScore ?? ai.totalMatchScore
  };

  // Validate overall score
  const overallValidation = validateOverallScore(aiScores);
  
  // Cross-validate with deterministic
  const crossValidation = crossValidateScores(aiScores, deterministicScores);

  // Determine if AI scores should be used
  const useAIScores = crossValidation.isValid && overallValidation.isValid;

  if (!useAIScores) {
    logger.warn('AI scores failed validation, using deterministic', {
      crossValid: crossValidation.validations.filter(v => v.status === 'FAIL'),
      overallDeviation: overallValidation.deviation
    });
    return deterministicScores;
  }

  // Use AI scores with deterministic fallback for arrays
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

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

/**
 * Main resume analysis function
 */
export const analyzeResume = async (resumeText, advertisement) => {
  const startTime = Date.now();
  
  try {
    if (!resumeText) throw new Error('Resume text is required');
    if (!advertisement) throw new Error('Job advertisement is required');

    // Sanitize and clean
    const sanitizedResume = piiSanitizer.sanitize(resumeText);
    const cleanedResume = textProcessor.cleanResumeText(sanitizedResume);
    
    // Check cache
    const cacheKey = scoringUtils.generateCacheKey(cleanedResume, advertisement);
    const cachedResult = analysisCache.get(cacheKey);
    if (cachedResult) {
      logger.info('Cache hit');
      return { ...cachedResult, fromCache: true };
    }

    // Calculate deterministic scores
    const deterministicScores = calculateDeterministicScores(cleanedResume, advertisement);
    
    // Decide on AI call
    let aiResult = null;
    if (apiKeyManager.getActiveKeyCount() > 0 && usageTracker.canMakeRequest() && cleanedResume.length > 100) {
      try {
        logger.info('Calling AI for analysis');
        usageTracker.recordRequest();
        aiResult = await getAIAnalysis(cleanedResume, advertisement);
      } catch (aiError) {
        logger.warn('AI failed, using deterministic', { error: aiError.message });
      }
    }

    // Merge and cache
    const finalResult = mergeScores(aiResult, deterministicScores);
    analysisCache.set(cacheKey, finalResult);

    // Build metadata
    const metadata = {
      analyzedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      aiEnhanced: !!aiResult && finalResult.aiEnhanced,
      modelUsed: aiResult?.metadata?.modelUsed || 'deterministic',
      apiKeyUsed: aiResult?.metadata?.apiKeyUsed || 'none',
      piiSanitized: resumeText !== sanitizedResume,
      fromCache: false
    };

    return { ...finalResult, metadata };

  } catch (error) {
    logger.error('Analysis failed', error);
    return buildErrorResponse(startTime, error);
  }
};

/**
 * Build error response
 */
const buildErrorResponse = (startTime, error) => ({
  overallScore: 0,
  totalMatchScore: 0,
  skillsScore: 0,
  experienceScore: 0,
  educationScore: 0,
  atsScore: 0,
  breakdown: { skillsScore: 0, experienceScore: 0, educationScore: 0, atsReadabilityScore: 0 },
  reasoning: 'Analysis failed due to system error.',
  matchedSkills: [],
  missingSkills: [],
  bonusSkills: [],
  candidateExperienceYears: 0,
  quantifiableAchievements: [],
  atsFormattingFlags: [],
  strengths: [],
  redFlags: ['Analysis failed - manual review required'],
  summary: 'Analysis could not be completed.',
  aiEnhanced: false,
  analysisType: 'failed',
  metadata: {
    analyzedAt: new Date().toISOString(),
    processingTime: Date.now() - startTime,
    aiEnhanced: false,
    error: error.message
  }
});

// ============================================
// EXPORTS
// ============================================

export const getCacheStats = () => ({
  size: analysisCache.size,
  maxSize: THRESHOLDS.MAX_CACHE_SIZE,
  performance: fallbackService?.getPerformanceReport() || {},
  apiKeys: apiKeyManager.getStats(),
  activeApiKeys: apiKeyManager.getActiveKeyCount(),
  usageToday: usageTracker.requestsToday,
  usageThisMinute: usageTracker.requestsThisMinute
});

export const clearCache = () => {
  analysisCache.clear();
  piiSanitizer.resetStats();
  logger.info('Cache cleared');
};

export const getUsageStats = () => ({
  requestsToday: usageTracker.requestsToday,
  requestsThisMinute: usageTracker.requestsThisMinute,
  apiKeys: apiKeyManager.getStats(),
  cacheSize: analysisCache.size
});