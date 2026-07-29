// utils/piiSanitizer.js

import { PII_PATTERNS } from '../../config/constants.js';
import { logger } from './logger.js';

class PIISanitizer {
  constructor(options = {}) {
    this.options = {
      replaceWith: options.replaceWith || '[REDACTED]',
      maskEmail: options.maskEmail !== false,
      maskPhone: options.maskPhone !== false,
      maskAddress: options.maskAddress !== false,
      maskName: options.maskName !== false,
      maskSocial: options.maskSocial !== false,
      maskUrls: options.maskUrls !== false,
      maskSalary: options.maskSalary !== false,
      maskDOB: options.maskDOB !== false,
      maskNationality: options.maskNationality !== false,
      maskReligion: options.maskReligion !== false,
      maskPhoto: options.maskPhoto !== false
    };
    this.logger = logger.child('pii-sanitizer');
    this.stats = {
      totalProcessed: 0,
      piiDetected: 0,
      fieldsMasked: {}
    };
  }

  sanitize(text) {
    if (!text || typeof text !== 'string') return text;

    let sanitized = text;
    const detections = [];

    const operations = [
      { key: 'email', enabled: this.options.maskEmail, fn: this._maskEmails },
      { key: 'phone', enabled: this.options.maskPhone, fn: this._maskPhones },
      { key: 'salary', enabled: this.options.maskSalary, fn: this._maskSalary },
      { key: 'dob', enabled: this.options.maskDOB, fn: this._maskDOB },
      { key: 'nationality', enabled: this.options.maskNationality, fn: this._maskNationality },
      { key: 'religion', enabled: this.options.maskReligion, fn: this._maskReligion },
      { key: 'address', enabled: this.options.maskAddress, fn: this._maskAddresses },
      { key: 'social', enabled: this.options.maskSocial, fn: this._maskSocialMedia },
      { key: 'urls', enabled: this.options.maskUrls, fn: this._maskUrls },
      { key: 'photo', enabled: this.options.maskPhoto, fn: this._maskPhotoReferences },
      { key: 'name', enabled: this.options.maskName, fn: this._maskNames }
    ];

    for (const op of operations) {
      if (op.enabled) {
        const before = sanitized;
        sanitized = op.fn.call(this, sanitized);
        if (before !== sanitized) {
          detections.push(op.key);
          this.stats.fieldsMasked[op.key] = (this.stats.fieldsMasked[op.key] || 0) + 1;
        }
      }
    }

    this.stats.totalProcessed++;
    if (detections.length > 0) {
      this.stats.piiDetected++;
      this.logger.info('PII detected and masked', { 
        fields: detections,
        originalLength: text.length,
        sanitizedLength: sanitized.length
      });
    }

    return sanitized;
  }

  _maskEmails(text) {
    return text.replace(PII_PATTERNS.EMAIL, (match) => {
      const [username, domain] = match.split('@');
      if (!domain) return this.options.replaceWith;
      
      const maskedUser = username.length > 2 
        ? username[0] + '***' + username.slice(-1)
        : '***';
      const [domainName, ...tld] = domain.split('.');
      const maskedDomain = domainName[0] + '***';
      
      return `${maskedUser}@${maskedDomain}.${tld.join('.')}`;
    });
  }

  _maskPhones(text) {
    let result = text;
    for (const pattern of PII_PATTERNS.PHONE) {
      result = result.replace(pattern, (match) => {
        const digits = match.replace(/\D/g, '');
        if (digits.length >= 7) {
          return `***-***-${digits.slice(-4)}`;
        }
        return this.options.replaceWith;
      });
    }
    return result;
  }

  _maskSalary(text) {
    return text.replace(PII_PATTERNS.SALARY, this.options.replaceWith);
  }

  _maskDOB(text) {
    return text.replace(PII_PATTERNS.DOB, this.options.replaceWith);
  }

  _maskNationality(text) {
    return text.replace(PII_PATTERNS.NATIONALITY, this.options.replaceWith);
  }

  _maskReligion(text) {
    return text.replace(PII_PATTERNS.RELIGION, this.options.replaceWith);
  }

  _maskAddresses(text) {
    let result = text;
    for (const pattern of PII_PATTERNS.ADDRESS) {
      result = result.replace(pattern, this.options.replaceWith);
    }
    return result;
  }

  _maskSocialMedia(text) {
    let result = text;
    for (const pattern of PII_PATTERNS.SOCIAL_MEDIA) {
      result = result.replace(pattern, this.options.replaceWith);
    }
    return result;
  }

  _maskUrls(text) {
    let result = text;
    for (const pattern of PII_PATTERNS.URLS) {
      result = result.replace(pattern, this.options.replaceWith);
    }
    return result;
  }

  _maskPhotoReferences(text) {
    return text.replace(PII_PATTERNS.PHOTO, this.options.replaceWith);
  }

  _maskNames(text) {
    const namePatterns = [
      // Email-style name in headers
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})$/m,
      // All caps name
      /^([A-Z]{2,}(?:\s+[A-Z]{2,}){1,2})$/m,
      // Name after explicit label
      /(?:name|full\s*name|candidate|applicant|i am|i'm)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/i
    ];

    let result = text;
    for (const pattern of namePatterns) {
      const match = result.match(pattern);
      if (match) {
        result = result.replace(match[1] || match[0], this.options.replaceWith);
        break; // Only mask once
      }
    }

    // Mask first line if it looks like a name
    const lines = result.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$/.test(firstLine) && firstLine.length < 50) {
      lines[0] = this.options.replaceWith;
      result = lines.join('\n');
    }

    return result;
  }

  getStats() {
    return { ...this.stats };
  }

  resetStats() {
    this.stats = {
      totalProcessed: 0,
      piiDetected: 0,
      fieldsMasked: {}
    };
  }
}

export const piiSanitizer = new PIISanitizer();
export { PIISanitizer };