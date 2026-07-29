// config/constants.js

export const SCORING_WEIGHTS = {
  // Standard weights (when experience IS required)
  STANDARD: {
    SKILLS: 0.35,
    EXPERIENCE: 0.40,
    EDUCATION: 0.15,
    ATS: 0.10
  },
  
  // Entry-level weights (when experience is NOT required)
  ENTRY_LEVEL: {
    SKILLS: 0.55,      // Skills matter most for entry level
    EXPERIENCE: 0.10,  // Experience is just a bonus
    EDUCATION: 0.25,   // Education matters more
    ATS: 0.10
  }
};

export const THRESHOLDS = {
  MAX_SCORE_DEVIATION: 15,
  MAX_RESUME_CHARS: 15000,
  MAX_CACHE_SIZE: 100,
  DEFAULT_REQUIRED_EXPERIENCE: 2,
  MIN_CONFIDENCE_SCORE: 0.65,
  MAX_BATCH_SIZE: 10
};

export const MODEL_CONFIG = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: "application/json"
};

export const FALLBACK_CONFIG = {
  MAX_RETRIES: 1,
  TIMEOUT_MS: 20000,
  RETRY_DELAY_MS: 1000,
  COOLDOWN_MS: 300000, // 5 minutes cooldown for failed models
  MAX_RATE_LIMITS_BEFORE_SWITCH: 1 // Switch API key after 2 rate limits
};

// Preferred models in order
export const MODEL_CHAIN = [
  { name: "gemini-2.5-flash", type: "standard", priority: 1 },
  { name: "gemini-2.5-pro", type: "premium", priority: 2 },
  { name: "gemini-2.0-flash", type: "standard", priority: 3 },
  { name: "gemini-flash-latest", type: "standard", priority: 4 },
  { name: "gemini-pro-latest", type: "premium", priority: 5 }
];

// API Keys configuration
export const API_KEYS_CONFIG = {
  // Primary keys (loaded from env)
  PRIMARY: process.env.GEMINI_API_KEY,
  
  // Backup keys (comma-separated in env)
  BACKUP_KEYS: process.env.GEMINI_BACKUP_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || [],
  
  // Rate limit handling
  RATE_LIMIT_COOLDOWN: 60000, // 1 minute cooldown for rate-limited keys
  MAX_CONSECUTIVE_FAILURES: 3, // Mark key as dead after 3 consecutive failures
  HEALTH_CHECK_INTERVAL: 300000 // Check dead keys every 5 minutes
};

// PII Patterns (unchanged)
export const PII_PATTERNS = {
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PHONE: [
    /\+\d{1,4}[\s.-]?\(?\d{1,4}\)?[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g,
    /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
    /(?<!\d)(?:\+?\d{1,3}[-.\s]?)?\d{10,}(?!\d)/g,
    /(?:ext|x|ext\.)\s*\d{3,5}/gi
  ],
  ADDRESS: [
    /\d{1,6}\s+[\w\s,.]+(?:street|st\.?|avenue|ave\.?|road|rd\.?|boulevard|blvd\.?|lane|ln\.?|drive|dr\.?|court|ct\.?|circle|cir\.?|way|place|pl\.?|highway|hwy\.?|parkway|pkwy\.?)\s*,?\s*(?:[a-zA-Z]{2})?\s*\d{5}(?:-\d{4})?/gi,
    /P\.?\s*O\.?\s*Box\s+\d+/gi,
    /(?:apartment|apt\.?|suite|ste\.?|unit|#)\s*[\w\d-]+/gi
  ],
  SOCIAL_MEDIA: [
    /(?:linkedin\.com\/in\/|github\.com\/|twitter\.com\/|@)[\w.-]+/gi,
    /(?:facebook\.com\/|instagram\.com\/|behance\.net\/|dribbble\.com\/)[\w.@-]+/gi
  ],
  URLS: [
    /https?:\/\/[^\s<>"']+/g,
    /www\.[^\s<>"']+/g
  ],
  SALARY: /(?:\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?(?:\s*[-–]\s*\$\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?)?(?:\s*(?:\/|per|a|an)\s*(?:year|yr|month|mo|hour|hr|annum|annually))?)/gi,
  DOB: /(?:date\s*of\s*birth|dob|birth\s*date|born)(?:\s*:?\s*)(?:\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}|\d{2,4}[\/.-]\d{1,2}[\/.-]\d{1,2}|(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+\d{1,2},?\s+\d{4})/gi,
  NATIONALITY: /(?:nationality|citizenship|visa\s*status|work\s*auth\w*|eligible\s*to\s*work)\s*:?\s*[a-z\s]+/gi,
  RELIGION: /(?:religion|caste|marital\s*status|gender|sex|race|ethnicity)\s*:?\s*[a-z\s]+/gi,
  PHOTO: /(?:photo|photograph|picture|headshot|passport\s*size)/gi
};