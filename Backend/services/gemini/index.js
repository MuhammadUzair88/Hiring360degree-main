// services/gemini/index.js

import { piiSanitizer } from '../../utils/resumehandlers/piiSanitizer.js';
import { textProcessor } from '../../utils/resumehandlers/textProcessor.js';
import { scoringUtils } from '../../utils/resumehandlers/scoringUtils.js';
import { apiKeyManager } from '../apiKeyManager.js';
import { logger } from '../../utils/resumehandlers/logger.js';
import { analysisCache } from './cache.js';
import { usageTracker } from './usageTracker.js';
import { getAIAnalysis } from './aiAnalysis.js';
import { calculateDeterministicScores } from './deterministic/index.js';
import { mergeScores } from './merger.js';

export const analyzeResume = async (resumeText, advertisement) => {
  const startTime = Date.now();
  
  try {
    if (!resumeText) throw new Error('Resume text is required');
    if (!advertisement) throw new Error('Job advertisement is required');

    const sanitizedResume = piiSanitizer.sanitize(resumeText);
    const cleanedResume = textProcessor.cleanResumeText(sanitizedResume);
    
    const cacheKey = scoringUtils.generateCacheKey(cleanedResume, advertisement);
    const cachedResult = analysisCache.get(cacheKey);
    if (cachedResult) {
      logger.info('Cache hit');
      return { ...cachedResult, fromCache: true };
    }

    const deterministicScores = calculateDeterministicScores(cleanedResume, advertisement);
    
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

    const finalResult = mergeScores(aiResult, deterministicScores);
    analysisCache.set(cacheKey, finalResult);

    return {
      ...finalResult,
      metadata: {
        analyzedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        aiEnhanced: !!aiResult && finalResult.aiEnhanced,
        modelUsed: aiResult?.metadata?.modelUsed || 'deterministic',
        apiKeyUsed: aiResult?.metadata?.apiKeyUsed || 'none',
        piiSanitized: resumeText !== sanitizedResume,
        fromCache: false
      }
    };

  } catch (error) {
    logger.error('Analysis failed', error);
    return {
      overallScore: 0, totalMatchScore: 0,
      skillsScore: 0, experienceScore: 0, educationScore: 0, atsScore: 0,
      breakdown: { skillsScore: 0, experienceScore: 0, educationScore: 0, atsReadabilityScore: 0 },
      reasoning: 'Analysis failed due to system error.',
      matchedSkills: [], missingSkills: [], bonusSkills: [],
      candidateExperienceYears: 0, quantifiableAchievements: [], atsFormattingFlags: [],
      strengths: [], redFlags: ['Analysis failed - manual review required'],
      summary: 'Analysis could not be completed.',
      aiEnhanced: false, analysisType: 'failed',
      metadata: {
        analyzedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        aiEnhanced: false,
        error: error.message
      }
    };
  }
};

export const getCacheStats = () => ({
  size: analysisCache.size,
  maxSize: 100,
  usageToday: usageTracker.requestsToday,
  usageThisMinute: usageTracker.requestsThisMinute,
  apiKeys: apiKeyManager.getStats(),
  activeApiKeys: apiKeyManager.getActiveKeyCount()
});

export const clearCache = () => {
  analysisCache.clear();
  piiSanitizer.resetStats();
  logger.info('Cache cleared');
};