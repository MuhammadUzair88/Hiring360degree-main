// services/gemini/aiAnalysis.js

import { ModelFallbackService } from '../modelFallbackService.js';
import { apiKeyManager } from '../apiKeyManager.js';
import { ANALYSIS_PROMPTS } from '../../utils/resumehandlers/analysisPrompts.js';
import { buildAnalysisSchema } from './schemaBuilder.js';
import { logger } from '../../utils/resumehandlers/logger.js';

let fallbackService = null;

const initializeFallbackService = () => {
  if (!fallbackService && apiKeyManager.getActiveKeyCount() > 0) {
    fallbackService = new ModelFallbackService();
    logger.info('Model fallback service initialized');
  }
  return fallbackService;
};

export const getAIAnalysis = async (resumeText, advertisement) => {
  const service = initializeFallbackService();
  if (!service) throw new Error('No fallback service available');

  const prompt = ANALYSIS_PROMPTS.buildAnalysisPrompt(resumeText, advertisement);
  const schema = buildAnalysisSchema();

  return await service.executeWithFallback(prompt, schema);
};