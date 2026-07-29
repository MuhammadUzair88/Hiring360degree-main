// services/gemini/usageTracker.js

import { logger } from '../../utils/resumehandlers/logger.js';

export const usageTracker = {
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
    if (this.requestsThisMinute >= 4) {
      logger.warn('Rate limit approaching: minute limit');
      return false;
    }
    if (this.requestsToday >= 1400) {
      logger.warn('Rate limit approaching: daily limit');
      return false;
    }
    return true;
  },
  
  recordRequest() {
    this.requestsThisMinute++;
    this.requestsToday++;
  }
};