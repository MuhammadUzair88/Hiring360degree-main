import {
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
  Sparkles,
  Target,
  Layers,
  TrendingUp,
  Quote,
  CheckCircle2,
  Play,
} from "lucide-react";

/**
 * Single source of truth for the "Intelligence" landing page section.
 * Every component in this folder reads from here — update the copy or
 * the demo numbers in one place and the whole section stays in sync.
 */

// ---- Section header -------------------------------------------------
export const sectionIntro = {
  eyebrow: "AI Hiring Intelligence",
  headingLines: ["From Candidate Data to", "Hiring Intelligence"],
  description:
    "Our sophisticated AI engine doesn't just parse resumes; it contextualizes experience, maps skill trajectories, and surfaces hidden potential to provide structured, actionable hiring intelligence.",
};

// ---- Pipeline diagram (Data In -> AI Analysis -> Signals Out) -------
export const pipelineInputs = [
  { icon: FileText, label: "Data Input", value: "Resume.pdf" },
  { icon: Briefcase, label: "Structured", value: "Work History" },
  { icon: Code2, label: "Extracted", value: "Technical Skills" },
];

export const pipelineOutputs = [
  { icon: Target, label: "Experience Fit" },
  { icon: Layers, label: "Skill Alignment" },
  { icon: TrendingUp, label: "Career Relevance" },
];

// ---- Candidate + match showcase --------------------------------------
export const demoCandidate = {
  initials: "SA",
  name: "Sarah Ahmed",
  role: "Senior Frontend Engineer",
  resumeSections: [
    {
      icon: Briefcase,
      label: "Experience",
      value:
        "5 years building scalable web applications using React, TypeScript, and Node.js at TechCorp Inc.",
    },
    {
      icon: Code2,
      label: "Skills",
      value: "React, Redux, Node.js, TypeScript, AWS, GraphQL, Jest, Cypress.",
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: "BS in Software Engineering, University of Technology.",
    },
  ],
};

export const engineChecklist = [
  { icon: Briefcase, label: "5 Years Exp." },
  { icon: Code2, label: "React / TS / Node" },
  { icon: GraduationCap, label: "BS Software Eng" },
];

export const jobMatch = {
  roleTitle: "Senior Frontend Role",
  matchPercent: 92,
  requirements: [
    {
      label: "Req: 3+ Years React",
      fillPercent: 100,
      evidence:
        'Found evidence: "5 years building... using React" in Experience section.',
    },
    {
      label: "Req: TypeScript Mastery",
      fillPercent: 82,
      evidence:
        'Found strong correlation in Skills: "TypeScript" combined with Senior title.',
    },
  ],
};

// ---- Call to action ---------------------------------------------------
export const cta = {
  label: "Run AI Analysis Demo",
  icon: Play,
  href: "/login"
};

// Re-exported so components only need one import line for shared icons
export const icons = { Sparkles, CheckCircle2, Quote };