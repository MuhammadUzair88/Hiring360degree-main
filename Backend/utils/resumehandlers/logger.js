// utils/logger.js

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

class Logger {
  constructor(service = 'resume-analyzer') {
    this.service = service;
    this.level = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.INFO;
  }

  _formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${level}] ${timestamp} [${this.service}] ${message}${metaStr}`;
  }

  _shouldLog(level) {
    return LOG_LEVELS[level] <= this.level;
  }

  debug(message, meta = {}) {
    if (this._shouldLog('DEBUG')) {
      console.debug(this._formatMessage('DEBUG', message, meta));
    }
  }

  info(message, meta = {}) {
    if (this._shouldLog('INFO')) {
      console.log(this._formatMessage('INFO', message, meta));
    }
  }

  warn(message, meta = {}) {
    if (this._shouldLog('WARN')) {
      console.warn(this._formatMessage('WARN', message, meta));
    }
  }

  error(message, error = null) {
    if (this._shouldLog('ERROR')) {
      const meta = error ? {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join(' | ')
      } : {};
      console.error(this._formatMessage('ERROR', message, meta));
    }
  }

  child(service) {
    return new Logger(`${this.service}:${service}`);
  }
}

// Create and export singleton
const loggerInstance = new Logger();

export const logger = loggerInstance;
export default logger;