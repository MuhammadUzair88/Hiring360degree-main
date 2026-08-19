// src/components/LandingPage/Workflow/WorkflowSecurity.jsx

import { ScrollReveal } from "./ScrollReveal";
import { ShieldCheckIcon, BadgeCheckIcon } from "./Icons ";
import { workflowSecurity } from "./data";

const iconMap = {
  shieldCheck: ShieldCheckIcon,
  badgeCheck: BadgeCheckIcon,
};

export function WorkflowSecurity({ data = workflowSecurity }) {
  return (
    <section className="bg-secondary-50 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16">
        <ScrollReveal className="flex flex-col items-center gap-3 text-center">
          <h3 className="text-h3 text-gray-900">{data.heading}</h3>
          <p className="max-w-xl text-base text-gray-600">{data.subheading}</p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
          {data.cards.map((card, i) => {
            const Icon = iconMap[card.icon] ?? ShieldCheckIcon;
            return (
              <ScrollReveal key={card.title} delay={i * 100}>
                <div className="flex h-full flex-col items-start gap-3 rounded-xl border border-secondary-300 bg-secondary-50 p-8 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                  <span className="rounded-lg bg-primary-50 p-2.5 text-primary-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h4 className="text-h4 mt-1 text-gray-900">{card.title}</h4>
                  <p className="text-sm leading-5 text-gray-600">{card.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WorkflowSecurity;