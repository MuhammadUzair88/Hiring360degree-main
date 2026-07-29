// services/apiKeyManager.js

import { API_KEYS_CONFIG } from '../config/constants.js';
import { logger } from '../utils/resumehandlers/logger.js';

class APIKeyManager {
  constructor() {
    this.keys = [];
    this.currentIndex = 0;
    this.logger = null;
    this.initializeKeys();
  }

  initializeKeys() {
    // Initialize logger safely
    try {
      this.logger = logger?.child?.('api-key-manager') || logger;
    } catch (error) {
      // Fallback to console if logger fails
      this.logger = {
        info: (msg, meta) => console.log(`[INFO] [api-key-manager] ${msg}`, meta || ''),
        warn: (msg, meta) => console.warn(`[WARN] [api-key-manager] ${msg}`, meta || ''),
        error: (msg, meta) => console.error(`[ERROR] [api-key-manager] ${msg}`, meta || ''),
        debug: (msg, meta) => console.debug(`[DEBUG] [api-key-manager] ${msg}`, meta || '')
      };
    }

    // Add primary key
    if (API_KEYS_CONFIG.PRIMARY && API_KEYS_CONFIG.PRIMARY !== 'your_gemini_api_key_here') {
      this.keys.push({
        key: API_KEYS_CONFIG.PRIMARY,
        label: 'primary',
        isActive: true,
        failures: 0,
        rateLimitedUntil: null,
        lastUsed: null,
        totalRequests: 0,
        totalFailures: 0
      });
      this.logger.info('Primary API key loaded');
    } else {
      this.logger.warn('Primary API key not configured or using placeholder');
    }

    // Add backup keys
    if (API_KEYS_CONFIG.BACKUP_KEYS && API_KEYS_CONFIG.BACKUP_KEYS.length > 0) {
      API_KEYS_CONFIG.BACKUP_KEYS.forEach((key, index) => {
        if (key && key.length > 10 && key !== 'your_api_key_here') {
          this.keys.push({
            key: key.trim(),
            label: `backup-${index + 1}`,
            isActive: true,
            failures: 0,
            rateLimitedUntil: null,
            lastUsed: null,
            totalRequests: 0,
            totalFailures: 0
          });
          this.logger.info(`Backup API key ${index + 1} loaded`);
        }
      });
    }

    if (this.keys.length === 0) {
      this.logger.warn('No valid API keys found! AI analysis will use deterministic scoring only.');
    } else {
      this.logger.info(`Total API keys loaded: ${this.keys.length}`);
    }
  }

  /**
   * Get the next available API key
   */
  getActiveKey() {
    const now = Date.now();
    
    // Try to find a working key
    for (let i = 0; i < this.keys.length; i++) {
      const index = (this.currentIndex + i) % this.keys.length;
      const keyData = this.keys[index];
      
      // Check if key is active and not rate limited
      if (keyData.isActive) {
        if (keyData.rateLimitedUntil && now < keyData.rateLimitedUntil) {
          this.logger.debug(`Key ${keyData.label} is rate limited until ${new Date(keyData.rateLimitedUntil).toISOString()}`);
          continue;
        }
        
        // Check if key has too many consecutive failures
        if (keyData.failures >= API_KEYS_CONFIG.MAX_CONSECUTIVE_FAILURES) {
          this.logger.debug(`Key ${keyData.label} has too many failures (${keyData.failures})`);
          continue;
        }
        
        // Update current index for next call
        this.currentIndex = (index + 1) % this.keys.length;
        
        // Update usage stats
        keyData.lastUsed = now;
        keyData.totalRequests++;
        
        this.logger.debug(`Using API key: ${keyData.label}`);
        
        return {
          key: keyData.key,
          label: keyData.label
        };
      }
    }
    
    // All keys are exhausted, try emergency key
    return this._getEmergencyKey();
  }

  /**
   * Force get a key even if rate limited (emergency)
   */
  _getEmergencyKey() {
    const now = Date.now();
    
    // Find key with earliest rate limit expiry
    let bestKey = null;
    let earliestExpiry = Infinity;
    
    for (const keyData of this.keys) {
      if (keyData.isActive) {
        const expiry = keyData.rateLimitedUntil || 0;
        if (expiry < earliestExpiry) {
          earliestExpiry = expiry;
          bestKey = keyData;
        }
      }
    }
    
    if (bestKey && earliestExpiry <= now + 60000) {
      this.logger.warn(`Emergency: Using rate-limited key ${bestKey.label}, expires in ${Math.ceil((earliestExpiry - now) / 1000)}s`);
      bestKey.lastUsed = now;
      bestKey.totalRequests++;
      return {
        key: bestKey.key,
        label: bestKey.label + '-emergency'
      };
    }
    
    // If absolutely no key available, reset all keys
    if (this.keys.length > 0) {
      this.logger.warn('All keys exhausted, resetting all keys to active state');
      this.keys.forEach(k => {
        k.rateLimitedUntil = null;
        k.failures = 0;
        k.isActive = true;
      });
      
      const firstKey = this.keys[0];
      firstKey.lastUsed = now;
      firstKey.totalRequests++;
      
      return {
        key: firstKey.key,
        label: firstKey.label + '-reset'
      };
    }
    
    this.logger.error('No API keys available at all!');
    return null;
  }

  /**
   * Mark a key as rate limited
   */
  markRateLimited(keyLabel) {
    const keyData = this.keys.find(k => k.label === keyLabel || k.key === keyLabel);
    if (keyData) {
      keyData.rateLimitedUntil = Date.now() + (API_KEYS_CONFIG.RATE_LIMIT_COOLDOWN || 60000);
      keyData.failures++;
      keyData.totalFailures++;
      
      this.logger.warn(`Key ${keyData.label} rate limited until ${new Date(keyData.rateLimitedUntil).toISOString()}`, {
        consecutiveFailures: keyData.failures,
        totalFailures: keyData.totalFailures
      });
      
      // If too many consecutive failures, schedule health check
      if (keyData.failures >= (API_KEYS_CONFIG.MAX_CONSECUTIVE_FAILURES || 5)) {
        this.logger.error(`Key ${keyData.label} marked as dead after ${keyData.failures} consecutive failures`);
        
        // Schedule health check after 5 minutes
        setTimeout(() => this._healthCheck(keyData), API_KEYS_CONFIG.HEALTH_CHECK_INTERVAL || 300000);
      }
    }
  }

  /**
   * Mark a key as successful (reset failure count)
   */
  markSuccess(keyLabel) {
    const keyData = this.keys.find(k => k.label === keyLabel || k.key === keyLabel);
    if (keyData) {
      // Reset failures on success
      if (keyData.failures > 0) {
        this.logger.info(`Key ${keyData.label} recovered, resetting failure count from ${keyData.failures}`);
      }
      keyData.failures = 0;
      keyData.rateLimitedUntil = null;
    }
  }

  /**
   * Mark a key as having an auth error (permanent failure)
   */
  markAuthError(keyLabel) {
    const keyData = this.keys.find(k => k.label === keyLabel || k.key === keyLabel);
    if (keyData) {
      keyData.isActive = false;
      keyData.failures = 999; // Permanent failure
      
      this.logger.error(`Key ${keyData.label} marked as invalid (authentication error) - permanently disabled`);
    }
  }

  /**
   * Health check a dead key
   */
  async _healthCheck(keyData) {
    this.logger.info(`Health checking dead key: ${keyData.label}`);
    
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${keyData.key}`
      );
      
      if (response.ok) {
        keyData.isActive = true;
        keyData.failures = 0;
        keyData.rateLimitedUntil = null;
        this.logger.info(`✅ Key ${keyData.label} is healthy again - reactivated!`);
      } else if (response.status === 429) {
        this.logger.info(`⏳ Key ${keyData.label} still rate limited, checking again in 5 minutes`);
        setTimeout(() => this._healthCheck(keyData), API_KEYS_CONFIG.HEALTH_CHECK_INTERVAL || 300000);
      } else {
        this.logger.error(`❌ Key ${keyData.label} still unhealthy (status: ${response.status}), checking again in 10 minutes`);
        setTimeout(() => this._healthCheck(keyData), (API_KEYS_CONFIG.HEALTH_CHECK_INTERVAL || 300000) * 2);
      }
    } catch (error) {
      this.logger.error(`Health check failed for key ${keyData.label}: ${error.message}`);
      // Retry after delay
      setTimeout(() => this._healthCheck(keyData), (API_KEYS_CONFIG.HEALTH_CHECK_INTERVAL || 300000));
    }
  }

  /**
   * Get statistics about all keys
   */
  getStats() {
    return this.keys.map(k => ({
      label: k.label,
      isActive: k.isActive,
      failures: k.failures,
      rateLimited: k.rateLimitedUntil ? new Date(k.rateLimitedUntil).toISOString() : null,
      lastUsed: k.lastUsed ? new Date(k.lastUsed).toISOString() : null,
      totalRequests: k.totalRequests,
      totalFailures: k.totalFailures,
      // Mask the key for security (show first 8 and last 4 characters)
      keyPreview: k.key ? `${k.key.substring(0, 8)}...${k.key.slice(-4)}` : 'none'
    }));
  }

  /**
   * Get count of active keys
   */
  getActiveKeyCount() {
    const now = Date.now();
    return this.keys.filter(k => 
      k.isActive && 
      (!k.rateLimitedUntil || now >= k.rateLimitedUntil) &&
      k.failures < (API_KEYS_CONFIG.MAX_CONSECUTIVE_FAILURES || 5)
    ).length;
  }

  /**
   * Reset all keys to active state
   */
  resetAllKeys() {
    this.keys.forEach(k => {
      k.isActive = true;
      k.failures = 0;
      k.rateLimitedUntil = null;
    });
    this.logger.info('All API keys reset to active state');
  }
}

// Create and export singleton
let instance = null;

const getAPIKeyManager = () => {
  if (!instance) {
    instance = new APIKeyManager();
  }
  return instance;
};

export const apiKeyManager = getAPIKeyManager();