// src/components/LandingPage/Workflow/WorkflowFeatureCardRight.jsx
//
// Text on the left, visual on the right. Pair with
// WorkflowFeatureCardLeft to alternate reading direction down the page —
// which side each feature uses is controlled by `side` in data.js.

import { ScrollReveal } from "./ScrollReveal";
import { WorkflowMockup } from "./WorkflowMockUp";
import {
  MegaphoneIcon,
  SparkleIcon,
  CalendarIcon,
  VideoIcon,
  FileTextIcon,
  CheckIcon,
} from "./Icons ";

const iconMap = {
  megaphone: MegaphoneIcon,
  sparkle: SparkleIcon,
  calendar: CalendarIcon,
  video: VideoIcon,
  fileText: FileTextIcon,
};

export function WorkflowFeatureCardRight({ feature }) {
  const Icon = iconMap[feature.icon] ?? SparkleIcon;

  return (
    <section
      id={feature.id}
      className="scroll-mt-[132px] border-b border-secondary-300 bg-secondary-50 px-4 py-16 sm:scroll-mt-[148px] sm:px-6 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
        <ScrollReveal className="flex flex-col items-start">
          <div className="inline-flex items-center gap-2">
            <span className="rounded-lg bg-primary-50 p-2 text-primary-700">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold text-primary-700">{feature.eyebrow}</span>
          </div>

          <h3 className="text-h3 mt-3 text-gray-900">{feature.title}</h3>
          <p className="mt-3 text-base leading-6 text-gray-600">{feature.description}</p>

          <ul className="mt-5 flex flex-col gap-3">
            {feature.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                <span className="text-sm text-gray-900">{bullet}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <WorkflowMockup image={feature.image} alt={feature.title} />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default WorkflowFeatureCardRight;