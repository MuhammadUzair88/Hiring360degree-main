// src/components/LandingPage/Workflow/WorkflowTabs.jsx
//
// Sticks just below the main site Navbar and highlights whichever feature
// section is currently in view. `top-[72px] sm:top-[88px]` approximates the
// Navbar's height — nudge those two values if the Navbar's padding changes.

import { useEffect, useState } from "react";
import { workflowTabs } from "./data";

export function WorkflowTabs({ tabs = workflowTabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  useEffect(() => {
    const sections = tabs
      .map((tab) => document.getElementById(tab.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tabs]);

  const handleClick = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="sticky top-[72px] z-30 border-b border-secondary-300 bg-secondary-50/90 backdrop-blur-[6px] sm:top-[88px]">
      <div className="mx-auto flex max-w-7xl justify-start gap-6 overflow-x-auto px-4 sm:justify-center sm:gap-10 sm:px-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <a
              key={tab.id}
              href={`#${tab.id}`}
              onClick={(e) => handleClick(e, tab.id)}
              className={`shrink-0 whitespace-nowrap border-b-2 py-3.5 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-primary-700 text-primary-700"
                  : "border-transparent text-gray-600 hover:text-primary-700"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowTabs;