// services/modelFallbackService.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { MODEL_CONFIG, FALLBACK_CONFIG, MODEL_CHAIN } from '../config/constants.js';
import { apiKeyManager } from './apiKeyManager.js';
import { logger } from '../utils/resumehandlers/logger.js';

class ModelFallbackService {
  constructor() {
    this.maxRetries = FALLBACK_CONFIG.MAX_RETRIES;
    this.timeout = FALLBACK_CONFIG.TIMEOUT_MS;
    this.retryDelay = FALLBACK_CONFIG.RETRY_DELAY_MS;
    this.modelChain = MODEL_CHAIN;
    this.failedModels = new Map();
    this.performanceMetrics = new Map();
    this.availableModels = null;
    this.currentApiKey = null;
    this.totalFailures = 0;
    this.maxTotalFailures = 4;  // ← Stop after 4 total failures
    this.logger = logger.child('fallback-service');
  }

  async discoverModels() {
    const keyData = apiKeyManager.getActiveKey();
    if (!keyData) return this.modelChain;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${keyData.key}`
      );
      
      if (response.ok) {
        apiKeyManager.markSuccess(keyData.label);
        const data = await response.json();
        
        const supportedModels = data.models
          ?.filter(m => {
            if (!m.supportedGenerationMethods?.includes('generateContent')) return false;
            if (!m.name.includes('gemini')) return false;
            if (m.name.includes('tts')) return false;
            if (m.name.includes('computer-use')) return false;
            if (m.name.includes('robotics')) return false;
            if (m.name.includes('image')) return false;
            // Only use stable models (no preview)
            if (m.name.includes('preview')) return false;
            return true;
          })
          .map(m => ({
            name: m.name.replace('models/', ''),
            displayName: m.displayName
          })) || [];
        
        const sortedModels = this._prioritizeModels(supportedModels);
        this.availableModels = sortedModels;
        return sortedModels;
      } else if (response.status === 429) {
        apiKeyManager.markRateLimited(keyData.label);
        return this.modelChain;
      } else if (response.status === 401 || response.status === 403) {
        apiKeyManager.markAuthError(keyData.label);
        return this.modelChain;
      }
    } catch (error) {
      this.logger.warn('Model discovery failed', { error: error.message });
    }
    
    return this.modelChain;
  }

  _prioritizeModels(models) {
    const priorityOrder = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-lite-latest',
      'gemini-2.5-pro',
      'gemini-flash-latest',
      'gemini-pro-latest'
    ];

    const prioritized = [];
    const remaining = [...models];

    for (const preferred of priorityOrder) {
      const index = remaining.findIndex(m => m.name === preferred);
      if (index !== -1) {
        prioritized.push({
          ...remaining[index],
          type: preferred.includes('pro') ? 'premium' : 'standard',
          priority: priorityOrder.indexOf(preferred) + 1
        });
        remaining.splice(index, 1);
      }
    }

    return prioritized.slice(0, 5); // ← Only keep top 5 models
  }

  async executeWithFallback(prompt, schema = null, context = {}) {
    const errors = [];
    const startTime = Date.now();
    this.totalFailures = 0;
    
    const discoveredModels = await this.discoverModels();
    const executionChain = discoveredModels.length > 0 ? discoveredModels : this.modelChain;
    const availableModels = this._getAvailableModels(executionChain);

    if (availableModels.length === 0) {
      this.failedModels.clear();
      return this.executeWithFallback(prompt, schema, context);
    }

    for (const modelConfig of availableModels) {
      // STOP if too many total failures
      if (this.totalFailures >= this.maxTotalFailures) {
        this.logger.warn(`Stopping after ${this.totalFailures} total failures`);
        break;
      }

      const maxAttempts = 1; // ← Only try each model ONCE
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const keyData = apiKeyManager.getActiveKey();
          
          if (!keyData) {
            this.logger.error('No API keys available!');
            throw new Error('No API keys available');
          }

          this.logger.info(`Trying: ${modelConfig.name} [${keyData.label}]`);

          const result = await this._executeWithModel(
            modelConfig.name,
            prompt,
            schema,
            attempt,
            keyData.key
          );

          const duration = Date.now() - startTime;
          this._recordSuccess(modelConfig.name, duration);
          apiKeyManager.markSuccess(keyData.label);

          return {
            ...result,
            modelUsed: modelConfig.name,
            apiKeyUsed: keyData.label,
            totalDuration: duration,
            fallbackUsed: errors.length > 0
          };

        } catch (error) {
          this.totalFailures++;
          
          errors.push({
            model: modelConfig.name,
            attempt,
            message: error.message,
            status: error.status || 500
          });

          // Rate limit or service unavailable → stop trying more
          if (error.status === 429 || error.status === 503) {
            this.logger.warn(`${modelConfig.name}: ${error.status === 429 ? 'Rate limited' : 'Unavailable'}`);
            if (error.status === 429) apiKeyManager.markRateLimited(error.apiKeyLabel);
            break; // Don't retry this model
          }

          // Auth error → stop completely
          if (error.status === 401 || error.status === 403) {
            apiKeyManager.markAuthError(error.apiKeyLabel);
            break;
          }

          // Model not found → stop
          if (error.status === 404) {
            this._recordPermanentFailure(modelConfig.name);
            break;
          }

          // Too many failures → stop
          if (this.totalFailures >= this.maxTotalFailures) break;
        }
      }
      
      this._recordFailure(modelConfig.name);
    }

    throw new Error(`All models exhausted after ${errors.length} attempts`);
  }

  async _executeWithModel(modelName, prompt, schema, attempt, apiKey) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${this.timeout}ms`)), this.timeout);
    });

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const generationConfig = {
        temperature: MODEL_CONFIG.temperature,
        topP: MODEL_CONFIG.topP,
        topK: MODEL_CONFIG.topK,
        maxOutputTokens: MODEL_CONFIG.maxOutputTokens,
        responseMimeType: "application/json"
      };

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
        ]
      });

      const result = await Promise.race([
        model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        }),
        timeoutPromise
      ]);

      const response = result.response;
      
      let text;
      try {
        text = response.text();
      } catch (textError) {
        if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
          text = response.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Failed to extract text from response');
        }
      }

      const parsed = this._parseResponse(text, modelName);

      return {
        parsed,
        rawText: text,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        }
      };

    } catch (error) {
      if (error.message?.includes('Timeout')) {
        throw Object.assign(new Error(`Timeout after ${this.timeout}ms`), { status: 408 });
      }
      error.apiKeyLabel = 'unknown';
      throw error;
    }
  }

  _parseResponse(text, modelName) {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in response');
    }
    
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1);

    try {
      return JSON.parse(cleaned);
    } catch (error) {
      try {
        cleaned = cleaned
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/:\s*'([^']*)'/g, ':"$1"');
        
        const openBraces = (cleaned.match(/{/g) || []).length;
        const closeBraces = (cleaned.match(/}/g) || []).length;
        if (openBraces > closeBraces) {
          cleaned += '}'.repeat(openBraces - closeBraces);
        }
        
        return JSON.parse(cleaned);
      } catch (secondError) {
        throw new Error(`JSON parse failed`);
      }
    }
  }

  _getAvailableModels(chain) {
    const now = Date.now();
    const cooldownPeriod = FALLBACK_CONFIG.COOLDOWN_MS;

    return chain.filter(model => {
      const failure = this.failedModels.get(model.name);
      if (!failure) return true;
      if (failure.permanent) return false;
      
      const cooldownElapsed = (now - failure.timestamp) > cooldownPeriod;
      if (cooldownElapsed) {
        this.failedModels.delete(model.name);
        return true;
      }
      return false;
    });
  }

  _recordSuccess(modelName, duration) {
    const metrics = this.performanceMetrics.get(modelName) || { successes: 0, failures: 0 };
    metrics.successes++;
    this.performanceMetrics.set(modelName, metrics);
  }

  _recordFailure(modelName) {
    this.failedModels.set(modelName, { timestamp: Date.now(), permanent: false });
    const metrics = this.performanceMetrics.get(modelName) || { successes: 0, failures: 0 };
    metrics.failures++;
    this.performanceMetrics.set(modelName, metrics);
  }

  _recordPermanentFailure(modelName) {
    this.failedModels.set(modelName, { timestamp: Date.now(), permanent: true });
  }

  getPerformanceReport() {
    return {
      models: Object.fromEntries(this.performanceMetrics),
      apiKeys: apiKeyManager.getStats(),
      activeApiKeys: apiKeyManager.getActiveKeyCount()
    };
  }
}

export { ModelFallbackService };