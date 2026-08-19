// src/components/LandingPage/Workflow/WorkflowIntegrations.jsx
//
// Logo chips are text placeholders. Once real SVG logos are available, drop
// them into `tools` in data.js as { name, logo } and swap the chip body for
// an <img src={logo} alt={name} /> — the layout doesn't need to change.

import { ScrollReveal } from "./ScrollReveal";
import { workflowIntegrations } from "./data";

export function WorkflowIntegrations({ data = workflowIntegrations }) {
  return (
    <section className="border-b border-secondary-300 bg-secondary-50 px-4 py-16 sm:px-6 sm:py-20">
      <ScrollReveal className="mx-auto flex max-w-7xl flex-col items-center gap-10">
        <h4 className="text-h4 text-center text-gray-900">{data.heading}</h4>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {data.tools.map((tool) => (
            <div
              key={tool}
              className="flex h-12 w-32 items-center justify-center rounded-md bg-secondary-200 opacity-80 transition-opacity hover:opacity-100"
            >
              <span className="text-sm font-medium text-gray-600">{tool}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

export default WorkflowIntegrations;