// data.js
// Single source of truth for the Hero section's content.
// Keeping copy here (instead of inline in JSX) means HeroOverview.jsx stays
// pure markup/layout, and this file stays pure content — swap languages,
// run A/B copy tests, or feed this from a CMS without touching the component.

export const heroData = {
  badge: "AI Hiring Intelligence",

  // "highlight" words get the purple treatment (text-primary-500) wherever
  // they appear in the headline — see HeroOverview.jsx's renderHeadline().
  headline: {
    lines: ["Hire smarter.", "Hire in half the time."],
    highlight: "Hire",
  },

  description:
    "Streamline your recruitment lifecycle with intelligent sourcing, automated screening, and predictive analytics designed for modern B2B enterprise teams.",

  primaryCta: {
    label: "Start Free Trial",
    href: "/login",
  },

  secondaryCta: {
    label: "Watch Demo",
    href: "/register",
  },

  footnote: "No credit card required",

  preview: {
    imageSrc: "https://placehold.co/582x434",
    imageAlt: "Product dashboard preview",
  },
};

export default heroData;