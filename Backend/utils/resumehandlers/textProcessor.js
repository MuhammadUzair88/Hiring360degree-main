// utils/textProcessor.js

import { THRESHOLDS } from '../../config/constants.js';
import { logger } from './logger.js';

class TextProcessor {
  constructor() {
    this.logger = logger.child('text-processor');
  }

  cleanResumeText(text) {
    if (!text) return '';

    let cleaned = text
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[•●○◦▪▸▹►▻]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013\u2014]/g, '-')
      .trim();

    if (cleaned.length > THRESHOLDS.MAX_RESUME_CHARS) {
      this.logger.warn('Resume truncated', {
        originalLength: cleaned.length,
        maxLength: THRESHOLDS.MAX_RESUME_CHARS
      });
      cleaned = cleaned.substring(0, THRESHOLDS.MAX_RESUME_CHARS);
    }

    return cleaned;
  }

  extractSkills(text) {
    const skills = new Set();
    const lowerText = text.toLowerCase();

    const skillPatterns = [
      /\b(?:javascript|js|typescript|ts|python|java|c\+\+|c#|ruby|php|swift|kotlin|go|rust|scala|r|matlab|perl|sql|html5?|css3?|bash|shell|powershell|dart)\b/gi,
      /\b(?:react\.?js|react|next\.?js|nextjs|angular|vue\.?js|vue|svelte|jquery|bootstrap|tailwind\s*css|tailwind|redux|redux\s*toolkit|zustand|mobx|graphql|apollo|rest\s*api|restful|axios)\b/gi,
      /\b(?:node\.?js|nodejs|express\.?js|express|django|flask|spring\s*boot|spring|laravel|rails|fastapi|nestjs|socket\.?io|websocket|jwt|oauth|passport)\b/gi,
      /\b(?:mongodb|mongo|mysql|postgresql|postgres|redis|elasticsearch|cassandra|dynamodb|oracle|sqlite|mariadb|firebase|supabase|prisma|mongoose|sequelize)\b/gi,
      /\b(?:aws|amazon\s*web\s*services|azure|gcp|google\s*cloud|docker|kubernetes|k8s|jenkins|terraform|ansible|circleci|github\s*actions|gitlab\s*ci|vercel|netlify|heroku|railway|render|cloudinary)\b/gi,
      /\b(?:git|github|gitlab|bitbucket|postman|swagger|jira|trello|asana|figma|sketch|adobe\s*xd|photoshop|illustrator|vscode|intellij|eclipse|webpack|babel|eslint|prettier|npm|yarn|pnpm)\b/gi,
      /\b(?:project management|agile|scrum|kanban|waterfall|notion|confluence)\b/gi,
      /\b(?:seo|sem|google analytics|hubspot|salesforce|mailchimp|marketo|pardot|hootsuite|buffer)\b/gi,
      /\b(?:excel|quickbooks|sap|oracle financials|bloomberg|tableau|power bi|looker|qlik)\b/gi,
      /\b(?:leadership|communication|teamwork|problem.solving|analytical|critical.thinking|time.management|presentation|negotiation|mentoring|coaching)\b/gi
    ];

    for (const pattern of skillPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => skills.add(match.toLowerCase().trim()));
      }
    }

    const skillsSection = text.match(/(?:technical\s*skills|skills|technologies|tech\s*stack)[\s:]*([\s\S]*?)(?=\n\s*(?:experience|education|projects|certification|achievement|award|$))/i);
    if (skillsSection) {
      const skillsText = skillsSection[1] || skillsSection[0];
      skillsText.split(/[,;•●◦\n|]/).forEach(skill => {
        const cleaned = skill.replace(/^[:\-\s]+/, '').trim().toLowerCase();
        if (cleaned.length > 1 && cleaned.length < 50 && !cleaned.match(/^(languages|frontend|backend|databases|devops|tools|soft|skills)/i)) {
          skills.add(cleaned);
        }
      });
    }

    return Array.from(skills);
  }

  /**
   * Extract total experience years - EXPLICIT TEXT takes priority over date ranges
   */
  extractExperienceYears(text) {
    const lowerText = text.toLowerCase().trim();
    
    // STEP 1: Try explicit statements FIRST (most reliable - "2+ years experience")
    const explicitYears = this._extractExplicitExperience(lowerText);
    if (explicitYears > 0) {
      this.logger.debug('Experience from explicit statement', { years: explicitYears });
      return explicitYears;
    }
    
    // STEP 2: Parse date ranges as fallback
    const dateRanges = this._extractDateRanges(lowerText);
    
    if (dateRanges.length > 0) {
      const mergedRanges = this._mergeOverlappingRanges(dateRanges);
      
      let totalMonths = 0;
      for (const range of mergedRanges) {
        const months = this._monthsBetween(range.start, range.end);
        if (months > 0 && months < 600) {
          totalMonths += months;
        }
      }
      
      const totalYears = totalMonths / 12;
      
      if (totalYears > 0 && totalYears <= 50) {
        // Round to clean number
        let cleanYears;
        if (totalYears >= 1) {
          cleanYears = Math.round(totalYears * 2) / 2; // Round to nearest 0.5
        } else {
          cleanYears = Math.round(totalYears * 12) / 12; // Keep months precision
        }
        
        this.logger.debug('Experience from date ranges', {
          rangesFound: dateRanges.length,
          mergedTo: mergedRanges.length,
          totalMonths,
          totalYears,
          cleanYears
        });
        
        return cleanYears;
      }
    }
    
    return 0;
  }

  /**
   * Extract experience from explicit text statements
   */
  _extractExplicitExperience(text) {
    // Pattern 1: "X+ years of experience" - most common in summaries
    const summaryMatch = text.match(/(\d+)\+?\s*years?\s*(?:of\s*)?(?:experience|work|professional|hands-on|relevant)/i);
    if (summaryMatch) {
      const years = parseInt(summaryMatch[1]);
      if (years > 0 && years <= 50) return years;
    }
    
    // Pattern 2: "Total experience: X years" or "Overall experience: X years"
    const totalMatch = text.match(/(?:total|overall)\s*experience\s*:?\s*(\d+)\+?\s*years?/i);
    if (totalMatch) {
      const years = parseInt(totalMatch[1]);
      if (years > 0 && years <= 50) return years;
    }
    
    // Pattern 3: "Experience: X years"
    const expMatch = text.match(/experience\s*:?\s*(\d+)\+?\s*years?/i);
    if (expMatch) {
      const years = parseInt(expMatch[1]);
      if (years > 0 && years <= 50) return years;
    }
    
    // Pattern 4: "X years" near "experience"
    const nearMatch = text.match(/(\d+)\s*years?\s*(?:of\s*)?(?:professional|work|hands-on|industry)?\s*experience/i);
    if (nearMatch) {
      const years = parseInt(nearMatch[1]);
      if (years > 0 && years <= 50) return years;
    }
    
    // Pattern 5: "X months experience" -> convert to years
    const monthMatch = text.match(/(\d+)\s*months?\s*(?:of\s*)?(?:work|professional)?\s*experience/i);
    if (monthMatch) {
      const months = parseInt(monthMatch[1]);
      if (months > 0 && months <= 600) {
        return months >= 12 ? Math.round(months / 12) : Math.round((months / 12) * 10) / 10;
      }
    }
    
    return 0;
  }

  /**
   * Extract date ranges from text
   */
  _extractDateRanges(text) {
    const ranges = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    const monthMap = {
      'jan': 1, 'january': 1, 'feb': 2, 'february': 2,
      'mar': 3, 'march': 3, 'apr': 4, 'april': 4,
      'may': 5, 'jun': 6, 'june': 6,
      'jul': 7, 'july': 7, 'aug': 8, 'august': 8,
      'sep': 9, 'september': 9, 'oct': 10, 'october': 10,
      'nov': 11, 'november': 11, 'dec': 12, 'december': 12
    };
    
    const monthNames = Object.keys(monthMap).join('|');
    
    // Month Year - Present
    const p1 = new RegExp(`(${monthNames})[\\s,.-]*(\\d{4})\\s*[–—to\\-]+\\s*(present|current|now|till\\s*date)`, 'gi');
    // Month Year - Month Year
    const p2 = new RegExp(`(${monthNames})[\\s,.-]*(\\d{4})\\s*[–—to\\-]+\\s*(${monthNames})[\\s,.-]*(\\d{4})`, 'gi');
    // Year - Present
    const p3 = /(\d{4})\s*[–—to\-]+\s*(present|current|now|till\s*date)/gi;
    // Year - Year (skip education)
    const p4 = /(\d{4})\s*[–—to\-]+\s*(\d{4})/gi;
    // MM/YYYY - MM/YYYY
    const p5 = /(\d{1,2})\s*\/\s*(\d{4})\s*[–—to\-]+\s*(\d{1,2})\s*\/\s*(\d{4})/g;
    // MM/YYYY - Present
    const p6 = /(\d{1,2})\s*\/\s*(\d{4})\s*[–—to\-]+\s*(present|current|now)/gi;

    let match;
    
    // Process Month Year - Present
    while ((match = p1.exec(text)) !== null) {
      const y = parseInt(match[2]);
      if (y >= 1990 && y <= currentYear) {
        ranges.push({
          start: { year: y, month: monthMap[match[1].toLowerCase()] || 1 },
          end: { year: currentYear, month: currentMonth }
        });
      }
    }

    // Process Month Year - Month Year
    while ((match = p2.exec(text)) !== null) {
      const sy = parseInt(match[2]), ey = parseInt(match[4]);
      if (sy >= 1990 && ey >= sy) {
        ranges.push({
          start: { year: sy, month: monthMap[match[1].toLowerCase()] || 1 },
          end: { 
            year: Math.min(ey, currentYear), 
            month: ey >= currentYear ? Math.min(monthMap[match[3].toLowerCase()] || 12, currentMonth) : (monthMap[match[3].toLowerCase()] || 12) 
          }
        });
      }
    }

    // Process Year - Present
    while ((match = p3.exec(text)) !== null) {
      const y = parseInt(match[1]);
      if (y >= 1990 && y <= currentYear) {
        ranges.push({ start: { year: y, month: 6 }, end: { year: currentYear, month: currentMonth } });
      }
    }

    // Process Year - Year (skip education dates)
    while ((match = p4.exec(text)) !== null) {
      const sy = parseInt(match[1]), ey = parseInt(match[2]);
      const ctx = text.substring(Math.max(0, match.index - 80), Math.min(text.length, match.index + match[0].length + 80));
      if (!/(?:education|university|college|degree|bachelor|master|phd|school|academic|study|student|cgpa|gpa)/i.test(ctx)) {
        if (sy >= 1990 && ey >= sy && ey <= currentYear + 1) {
          ranges.push({
            start: { year: sy, month: 6 },
            end: { year: Math.min(ey, currentYear), month: ey >= currentYear ? currentMonth : 6 }
          });
        }
      }
    }

    // Process MM/YYYY - MM/YYYY
    while ((match = p5.exec(text)) !== null) {
      const sm = parseInt(match[1]), sy = parseInt(match[2]);
      const em = parseInt(match[3]), ey = parseInt(match[4]);
      if (sm >= 1 && sm <= 12 && em >= 1 && em <= 12 && sy >= 1990 && ey <= currentYear + 1) {
        ranges.push({
          start: { year: sy, month: sm },
          end: { year: Math.min(ey, currentYear), month: ey > currentYear ? currentMonth : em }
        });
      }
    }

    // Process MM/YYYY - Present
    while ((match = p6.exec(text)) !== null) {
      const m = parseInt(match[1]), y = parseInt(match[2]);
      if (m >= 1 && m <= 12 && y >= 1990 && y <= currentYear) {
        ranges.push({ start: { year: y, month: m }, end: { year: currentYear, month: currentMonth } });
      }
    }

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const r of ranges) {
      const k = `${r.start.year}-${r.start.month}-${r.end.year}-${r.end.month}`;
      if (!seen.has(k)) { seen.add(k); unique.push(r); }
    }
    return unique;
  }

  _mergeOverlappingRanges(ranges) {
    if (ranges.length === 0) return [];
    const sorted = [...ranges].sort((a, b) => 
      a.start.year !== b.start.year ? a.start.year - b.start.year : a.start.month - b.start.month
    );
    const merged = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const curr = sorted[i], last = merged[merged.length - 1];
      const le = last.end.year * 12 + last.end.month;
      const cs = curr.start.year * 12 + curr.start.month;
      const ce = curr.end.year * 12 + curr.end.month;
      if (cs <= le + 1) { if (ce > le) last.end = { ...curr.end }; }
      else merged.push(curr);
    }
    return merged;
  }

  _monthsBetween(start, end) {
    return ((end.year - start.year) * 12) + (end.month - start.month);
  }

  evaluateEducation(text) {
    const lowerText = text.toLowerCase();
    const levels = [
      { keywords: ['phd', 'ph.d', 'doctorate', 'doctoral', 'doctor of'], level: 'doctorate', score: 100 },
      { keywords: ['master', 'm.s.', 'm.sc', 'mba', 'mtech', 'm.a.', 'm.eng', 'msc', 'mphil'], level: 'masters', score: 90 },
      { keywords: ['bachelor', 'b.s.', 'b.sc', 'btech', 'b.a.', 'b.eng', 'undergraduate', 'bs', 'ba'], level: 'bachelors', score: 80 },
      { keywords: ['associate', 'diploma', 'certification', 'certificate', 'vocational'], level: 'diploma', score: 60 },
      { keywords: ['high school', 'ged', 'secondary', 'intermediate', '12th', '10th'], level: 'highschool', score: 40 }
    ];
    for (const edu of levels) {
      if (edu.keywords.some(key => lowerText.includes(key))) return edu;
    }
    return { level: 'unspecified', score: 30 };
  }

  calculateReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (sentences.length === 0 || words.length === 0) return 0;
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = words.reduce((sum, word) => sum + this._countSyllables(word), 0) / words.length;
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  _countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }

  checkSectionCompleteness(text) {
    const sections = {
      contact: /(?:email|phone|contact|address|linkedin)/i,
      summary: /(?:summary|objective|profile|about\s*me|professional\s*summary)/i,
      experience: /(?:experience|employment|work\s*history|professional\s*experience|career)/i,
      education: /(?:education|academic|qualification|university|college|degree)/i,
      skills: /(?:skills|technologies|competencies|expertise|proficiencies)/i
    };
    let score = 0;
    for (const pattern of Object.values(sections)) {
      if (pattern.test(text)) score += 20;
    }
    return score;
  }
}

export const textProcessor = new TextProcessor();
export { TextProcessor };