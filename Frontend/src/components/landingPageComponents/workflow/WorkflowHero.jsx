// src/components/LandingPage/Workflow/WorkflowHero.jsx

import { Link } from "react-router-dom";
import { ScrollReveal } from "./ScrollReveal";
import { PlayIcon, ArrowRightIcon } from "./Icons ";
import { workflowHero } from "./data";

export function WorkflowHero({ data = workflowHero }) {
  return (
    <ScrollReveal className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-20">
      <div className="rounded-full bg-primary-50 px-4 py-1 outline outline-1 -outline-offset-1 outline-primary-700/20">
        <span className="text-sm font-semibold uppercase tracking-wide text-primary-700">
          {data.eyebrow}
        </span>
      </div>

      <h2 className="text-h2 mt-5 text-gray-900">
        {data.heading.map((part, i) =>
          part.highlight ? (
            <span key={i} className="text-primary-700">
              {part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </h2>

      <p className="mt-4 max-w-2xl text-lg text-gray-600">{data.subheading}</p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          to={data.primaryCta.href}
          className="group inline-flex items-center gap-1.5 rounded-full bg-primary-700 px-8 py-4 text-sm font-semibold text-secondary-50 shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] transition-all hover:bg-primary-800 hover:-translate-y-0.5"
        >
          {data.primaryCta.label}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <a
          href={data.secondaryCta.href}
          className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-gray-900 outline outline-1 -outline-offset-1 outline-gray-400 transition-colors hover:bg-secondary-100"
        >
          <PlayIcon className="h-4 w-4 text-primary-700" />
          {data.secondaryCta.label}
        </a>
      </div>
    </ScrollReveal>
  );
}

export default WorkflowHero;