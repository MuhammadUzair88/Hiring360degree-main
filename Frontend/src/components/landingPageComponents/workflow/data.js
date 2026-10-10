// src/components/LandingPage/Workflow/data.js
//
// Single source of truth for every string, tab and feature shown in the
// Workflow section. Components stay "dumb" (pure presentation) and only
// this file needs to change when copy, order or count of features changes.
//
// Real screenshots: import them here like any other module (Vite/CRA turn
// the import into a bundled URL, same as hiring360Logo in Navbar.jsx) and
// pass the imported variable — not a string path — as `image` below.
import heroImage from "../../../assets/hero.png";
import airesume from "../../../assets/Ai-resume.jpeg"
import candidateIntakePhoto from "../../../assets/canintake.jpeg"
import round from "../../../assets/rounds.jpeg"
import inte from "../../../assets/int.jpeg"
import social from "../../../assets/socials.jpeg"
import offers from "../../../assets/offer.jpeg"

export const workflowHero = {
  eyebrow: "WORKFLOW",
  heading: [
    { text: "Everything you need to hire, ", highlight: false },
    { text: "in one place", highlight: true },
  ],
  subheading:
    "A unified recruitment platform designed to automate workflows, engage top talent, and drive data-backed hiring decisions with ease.",
  primaryCta: { label: "Start Free Trial", href: "/login" },
  secondaryCta: { label: "Watch Demo", href: "/login" },
};

// One tab per functionality below — clicking a tab scroll-spies to the
// matching feature section (matched by `id`).
export const workflowTabs = [
  { id: "social-posting", label: "Social Posting" },
  { id: "resume-analyzer", label: "Resume Analyzer" },
  { id: "scheduling", label: "Scheduling" },
  { id: "interviews", label: "Interviews" },
  { id: "offer-letters", label: "Offer Letters" },
];

// The five core functionalities. `side` controls which feature-card
// component renders it: "right" -> WorkflowFeatureCardRight (text left,
// image right), "left" -> WorkflowFeatureCardLeft (image left, text right).
// `image` is the screenshot shown in the browser-frame mockup — it's a
// placehold.co placeholder for now, just replace the URL with your real
// screenshot path (e.g. "/assets/screenshots/social-posting.png") whenever
// it's ready. Nothing else in the component needs to change.
export const workflowFeatures = [
  {
    id: "social-posting",
    side: "right",
    image: social,
    icon: "megaphone",
    eyebrow: "One-Click Distribution",
    title: "Publish everywhere, the moment you post.",
    description:
      "Stop copy-pasting job ads across five different tabs. Write the role once and InterVue360 drafts a polished pamphlet, then pushes it to every connected social and professional network at the same time.",
    bullets: [
      "Auto-publish to every connected social channel",
      "Branded, on-brand job pamphlets generated automatically",
      "One dashboard to track reach and applies per platform",
    ],
  },
  {
    id: "resume-analyzer",
    side: "left",
    image: candidateIntakePhoto,
    icon: "sparkle",
    eyebrow: "AI Resume Analyzer",
    title: "Identify top performers in minutes.",
    description:
      "Stop reviewing resumes manually. Every application is parsed and scored against the role's real requirements, so you and your team open the dashboard to a ranked shortlist, not a pile of PDFs.",
    bullets: [
      "AI resume parsing and skill matching",
      "Automatic scoring against role requirements",
      "Approve or reject a candidate with one click",
    ],
  },
  {
    id: "scheduling",
    side: "right",
    image: round,
    icon: "calendar",
    eyebrow: "Smart Scheduling",
    title: "Interviews that book themselves.",
    description:
      "Selected candidates get an instant email with real open slots. Interviewers see the same slots, links, and prep notes on their own dashboard — no thread of \"does Tuesday work\" required.",
    bullets: [
      "Calendar availability synced automatically",
      "Instant confirmation emails to candidate and panel",
      "Reschedule or cancel without back-and-forth",
    ],
  },
  {
    id: "interviews",
    side: "left",
    image: inte,
    icon: "video",
    eyebrow: "Online Interview Platform",
    title: "Run the entire interview from one tab.",
    description:
      "Conduct the interview inside InterVue360 itself. Candidate profile, resume, and role scorecard sit next to the call, so interviewers evaluate in the moment instead of piecing it together after.",
    bullets: [
      "Built-in video interviewing, no extra app needed",
      "Candidate profile and prep notes side-by-side with the call",
      "Structured feedback captured in real time",
    ],
  },
  {
    id: "offer-letters",
    side: "right",
    image: offers,
    icon: "fileText",
    eyebrow: "Offer & Close",
    title: "From decision to signed offer, instantly.",
    description:
      "Collect structured feedback from every interviewer, generate a branded offer letter from the role's template, and send it — all without leaving the candidate's profile.",
    bullets: [
      "Structured, side-by-side panel feedback",
      "Branded offer letters generated from your templates",
      "Sent for e-signature in a single click",
    ],
  },
];

export const workflowIntegrations = {
  heading: "Plays well with your favorite tools",
  tools: ["Slack", "Zoom", "Workday", "DocuSign", "LinkedIn", "Checkr"],
};

export const workflowSecurity = {
  heading: "Enterprise-grade security",
  subheading:
    "Your data is safe with us. We adhere to the highest industry standards.",
  cards: [
    {
      icon: "shieldCheck",
      title: "GDPR & CCPA Compliant",
      description:
        "Built-in tools to manage candidate consent, data retention policies, and right-to-be-forgotten requests effortlessly.",
    },
    {
      icon: "badgeCheck",
      title: "SOC 2 Type II Certified",
      description:
        "Independently audited to ensure our security practices, infrastructure, and operations meet strict enterprise requirements.",
    },
  ],
};