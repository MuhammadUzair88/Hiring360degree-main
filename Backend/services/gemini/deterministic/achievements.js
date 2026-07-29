// services/gemini/deterministic/achievements.js

export const extractAchievements = (text) => {
  const achievements = [];
  const patterns = [
    /(?:increased|decreased|improved|reduced|boosted|enhanced|optimized|streamlined|automated|saved|generated|grew|scaled)[^.!]*?(?:\d+%|\d+\s*percent)[^.!]*/gi,
    /(?:managed|budget|revenue|sales|saved|generated|worth|valued)[^.!]*?\$\s*\d+[^.!]*/gi,
    /(?:led|managed|mentored|trained|supervised|headed|directed)[^.!]*?(?:\d+\s*(?:people|team|developers|engineers|staff|members|employees))[^.!]*/gi,
    /(?:reduced|decreased|improved|shortened|accelerated|sped up)[^.!]*?(?:by\s*\d+\s*(?:days|weeks|months|hours|minutes)|from\s*\d+\s*(?:days|weeks|months)[^.!]*to\s*\d+)[^.!]*/gi,
    /(?:served|supported|handled|processed|managed|delivered)[^.!]*?\d+[^.!]*(?:users|customers|clients|requests|transactions|projects)[^.!]*/gi
  ];
  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) achievements.push(...matches.map(m => m.trim()));
  }
  return [...new Set(achievements)].slice(0, 5);
};