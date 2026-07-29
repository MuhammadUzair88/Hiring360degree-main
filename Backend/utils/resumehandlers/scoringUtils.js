// utils/resumehandlers/scoringUtils.js

import crypto from 'crypto';
import { SCORING_WEIGHTS, THRESHOLDS } from '../../config/constants.js';
import { logger } from './logger.js';

class ScoringUtils {
  constructor() {
    this.logger = logger.child('scoring');
  }

  calculateSkillsScore(matchedSkills, requiredSkills) {
    if (!requiredSkills?.length) return { score: 50, matchCount: 0, totalRequired: 0, percentage: 50, details: [] };
    if (!matchedSkills?.length) return { score: 0, matchCount: 0, totalRequired: requiredSkills.length, percentage: 0, details: [] };

    const requiredLower = requiredSkills.map(s => s.toLowerCase().trim());
    const matchedLower = matchedSkills.map(s => s.toLowerCase().trim());
    
    let matchCount = 0;
    const matchDetails = [];

    for (const required of requiredLower) {
      let isMatched = false;
      let matchType = 'none';

      if (matchedLower.some(m => m === required || m.includes(required) || required.includes(m))) {
        isMatched = true;
        matchType = 'direct';
      }

      if (!isMatched) {
        const reqTokens = required.split(/[\s\-_,.+()]+/).filter(t => t.length > 2);
        if (reqTokens.length > 0) {
          isMatched = matchedLower.some(matched => {
            const matchTokens = matched.split(/[\s\-_,.+()]+/).filter(t => t.length > 2);
            return reqTokens.some(rT => matchTokens.some(mT => mT.includes(rT) || rT.includes(mT)));
          });
          if (isMatched) matchType = 'partial';
        }
      }

      if (!isMatched) {
        const synonymMap = {
          'js': ['javascript', 'ecmascript'],
          'javascript': ['js', 'ecmascript'],
          'react': ['reactjs', 'react.js'],
          'node': ['nodejs', 'node.js'],
          'aws': ['amazon web services'],
          'gcp': ['google cloud', 'google cloud platform'],
          'azure': ['microsoft azure'],
          'k8s': ['kubernetes'],
          'ml': ['machine learning'],
          'ai': ['artificial intelligence'],
          'db': ['database'],
          'ui/ux': ['user interface', 'user experience'],
          'ci/cd': ['continuous integration', 'continuous deployment']
        };

        const synonyms = synonymMap[required] || [];
        if (synonyms.some(syn => matchedLower.some(m => m.includes(syn)))) {
          isMatched = true;
          matchType = 'synonym';
        }
      }

      if (isMatched) {
        matchCount++;
        matchDetails.push({ skill: required, matched: true, type: matchType });
      } else {
        matchDetails.push({ skill: required, matched: false, type: 'none' });
      }
    }

    const score = Math.round((matchCount / requiredSkills.length) * 100);

    return {
      score,
      matchCount,
      totalRequired: requiredSkills.length,
      percentage: Math.round((matchCount / requiredSkills.length) * 100),
      details: matchDetails
    };
  }

  /**
   * Extract required experience from job advertisement
   * Returns 0 for entry-level/fresher positions
   */
  extractRequiredExperience(advertisement) {
    // Priority 1: Check explicit experience field
    if (advertisement.experience && typeof advertisement.experience === 'string') {
      const expStr = advertisement.experience.toLowerCase().trim();
      
      // Handle entry-level indicators
      if (
        expStr === '0' || 
        expStr.includes('fresher') || 
        expStr.includes('no experience') || 
        expStr.includes('none') ||
        expStr.includes('entry') ||
        expStr.includes('intern') ||
        expStr.includes('trainee') ||
        expStr.includes('graduate') ||
        expStr.includes('0 years') ||
        expStr.includes('zero') ||
        expStr.includes('not required') ||
        expStr.includes('optional')
      ) {
        return 0;
      }
      
      // Handle "6 months" -> 0.5
      const monthMatch = expStr.match(/(\d+)\s*months?/);
      if (monthMatch) {
        return parseFloat((parseInt(monthMatch[1]) / 12).toFixed(2));
      }
      
      // Handle "1-3 years" -> take minimum
      const rangeMatch = expStr.match(/(\d+)\s*[-–—to]+\s*(\d+)\s*years?/);
      if (rangeMatch) {
        return parseInt(rangeMatch[1]);
      }
      
      // Handle "2 years" or "2+ years" or just "2"
      const yearMatch = expStr.match(/(\d+)\+?\s*years?/);
      if (yearMatch) {
        return parseInt(yearMatch[1]);
      }
      
      // Handle just a number like "5"
      const numMatch = expStr.match(/^(\d+)$/);
      if (numMatch) {
        return parseInt(numMatch[1]);
      }
    }
    
    // Priority 2: Parse from job title and description
    const fullText = `${advertisement.jobTitle || ''} ${advertisement.description || ''}`.toLowerCase();
    
    // Check for entry-level indicators in full text
    if (
      /(?:fresher|fresh|no experience|0 year|zero year|entry.level|entry\s*level|trainee|internship|intern\b|not required|optional)/i.test(fullText) &&
      !/(?:\d+\+?\s*years?\s*experience)/i.test(fullText)
    ) {
      return 0;
    }
    
    // Try "X+ years experience" or "X years of experience"
    const expMatch = fullText.match(/(\d+)\+?\s*years?\s*(?:of\s*)?experience/i);
    if (expMatch) {
      return parseInt(expMatch[1]);
    }
    
    // Try "minimum X years" or "at least X years"
    const minMatch = fullText.match(/(?:minimum|at\s*least)\s*(?:of\s*)?(\d+)\+?\s*years?/i);
    if (minMatch) {
      return parseInt(minMatch[1]);
    }
    
    // Try "experience required: X years"
    const reqMatch = fullText.match(/experience\s*(?:required|needed)?\s*:?\s*(\d+)\+?\s*years?/i);
    if (reqMatch) {
      return parseInt(reqMatch[1]);
    }
    
    // Priority 3: Infer from job title hierarchy
    if (/(?:senior|lead|principal|staff|head|chief|director|vp|president)/i.test(fullText)) return 5;
    if (/(?:mid|intermediate|associate)/i.test(fullText)) return 3;
    if (/(?:intern|trainee|fresher|entry.level|entry\s*level)/i.test(fullText)) return 0;
    if (/(?:junior|jr\.?|graduate)/i.test(fullText)) return 1;
    
    // Default: if no experience mentioned, return 0 (entry-level)
    return 0;
  }

  /**
   * Calculates experience score with proper handling of zero requirements
   */
  calculateExperienceScore(candidateYears, requiredYears) {
    // ENTRY-LEVEL: No experience required
    if (requiredYears === 0) {
      if (candidateYears >= 5) {
        return { score: 95, level: 'exceptional_for_entry', ratio: 999, candidateYears, requiredYears };
      }
      if (candidateYears >= 3) {
        return { score: 90, level: 'strong_for_entry', ratio: 999, candidateYears, requiredYears };
      }
      if (candidateYears >= 1) {
        return { score: 85, level: 'experienced_for_entry', ratio: 999, candidateYears, requiredYears };
      }
      if (candidateYears > 0) {
        return { score: 80, level: 'some_experience', ratio: 999, candidateYears, requiredYears };
      }
      // No experience required + no experience = perfect entry-level fit
      return { score: 88, level: 'entry_level_match', ratio: 1, candidateYears, requiredYears };
    }
    
    // Experience required but candidate has none
    if (candidateYears === 0) {
      return { score: 0, level: 'no_experience', ratio: 0, candidateYears, requiredYears };
    }

    const ratio = candidateYears / requiredYears;
    let score;
    let level;

    if (ratio >= 2.0) {
      score = Math.min(100, 95 + Math.floor(Math.random() * 5));
      level = 'exceptional';
    } else if (ratio >= 1.5) {
      score = Math.round(85 + ((ratio - 1.5) / 0.5) * 12);
      level = 'exceeds_significantly';
    } else if (ratio >= 1.2) {
      score = Math.round(75 + ((ratio - 1.2) / 0.3) * 15);
      level = 'exceeds';
    } else if (ratio >= 1.0) {
      score = Math.round(60 + ((ratio - 1.0) / 0.2) * 20);
      level = 'meets';
    } else if (ratio >= 0.8) {
      score = Math.round(45 + ((ratio - 0.8) / 0.2) * 23);
      level = 'close';
    } else if (ratio >= 0.5) {
      score = Math.round(25 + ((ratio - 0.5) / 0.3) * 25);
      level = 'below';
    } else if (ratio >= 0.2) {
      score = Math.round(10 + ((ratio - 0.2) / 0.3) * 20);
      level = 'significantly_below';
    } else {
      score = Math.max(2, Math.round(ratio * 75));
      level = 'minimal';
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      level,
      ratio: parseFloat(ratio.toFixed(2)),
      candidateYears,
      requiredYears
    };
  }

  calculateOverallScore(scores, weights = null) {
    // Use provided weights or default STANDARD
    const w = weights || SCORING_WEIGHTS.STANDARD;
    
    const overall = Math.round(
      (scores.skills || 0) * w.SKILLS +
      (scores.experience || 0) * w.EXPERIENCE +
      (scores.education || 0) * w.EDUCATION +
      (scores.ats || 0) * w.ATS
    );

    return Math.max(0, Math.min(100, overall));
  }

  generateCacheKey(resumeText, advertisement) {
    const data = JSON.stringify({
      resume: resumeText?.slice(0, 2000) || '',
      title: advertisement?.jobTitle || '',
      skills: advertisement?.skills?.sort()?.join(',') || '',
      exp: advertisement?.experience || '',
      desc: advertisement?.description?.slice(0, 500) || ''
    });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  sanitizeScore(score) {
    let numScore = Number(score) || 0;
    if (numScore <= 1 && numScore > 0) numScore = Math.round(numScore * 100);
    return Math.max(0, Math.min(100, Math.round(numScore)));
  }

  validateScoreConsistency(aiScores, deterministicScores) {
    const deviations = {
      skills: Math.abs((aiScores.skills || 0) - (deterministicScores.skills || 0)),
      experience: Math.abs((aiScores.experience || 0) - (deterministicScores.experience || 0)),
      education: Math.abs((aiScores.education || 0) - (deterministicScores.education || 0)),
      ats: Math.abs((aiScores.ats || 0) - (deterministicScores.ats || 0))
    };

    const maxDeviation = Math.max(...Object.values(deviations));
    const isConsistent = maxDeviation <= THRESHOLDS.MAX_SCORE_DEVIATION;

    return { isConsistent, maxDeviation, deviations };
  }
}

export const scoringUtils = new ScoringUtils();
export { ScoringUtils };