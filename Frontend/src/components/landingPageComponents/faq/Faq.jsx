import { useState } from "react";

const faqs = [
  {
    q: "How accurate is the AI resume scoring?",
    a: "Hiring360°'s scoring engine analyzes skills, experience, and role fit, producing a 0–100 compatibility score that consistently outperforms keyword-based screening. You can always override or recalibrate it.",
  },
  {
    q: "Does it integrate with Google Meet and Zoom?",
    a: "Yes. When you schedule an interview, Hiring360° auto-generates a meeting link and emails it to the candidate and interviewer within 60 seconds.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted in transit with TLS 1.3 and at rest with AES-256. Role-based access control and audit logs are included on every plan.",
  },
  {
    q: "Can we customize offer letters?",
    a: "Absolutely. Templates support your branding, dynamic candidate fields, and legal clauses. Letters are generated and emailed in one click.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are live in under 15 minutes — register your organization, post your first role, and the AI handles the rest.",
  },
];

/**
 * Faq — professional, exclusive accordion.
 * Controlled with a single `openIndex` so opening one question always
 * closes whichever one was open before — only one answer is ever visible
 * at a time. Built with real <button>/aria attributes (rather than native
 * <details>) so the exclusive-open behavior is explicit and doesn't rely
 * on the browser to close siblings for us.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex((current) => (current === i ? -1 : i));
  };

  return (
    <section id="faq" className="relative py-24 sm:py-28 bg-secondary-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-block rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
            FAQ
          </span>
          <h2 className="mt-4 text-h2 tracking-tight text-zinc-900">
            Questions, <span className="text-primary-700">answered.</span>
          </h2>
          <p className="mt-3 text-base text-neutral-600">
            Everything you need to know before you bring Hiring360° to your team.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-12 divide-y divide-secondary-300 rounded-2xl border border-secondary-300 bg-white shadow-[0px_4px_20px_0px_rgba(91,33,182,0.06)] overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={f.q} className={`px-6 sm:px-8 transition-colors ${isOpen ? "bg-primary-50/40" : ""}`}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full cursor-pointer items-center gap-5 py-6 text-left"
                >
                  <span
                    className={`flex-1 text-base sm:text-lg font-medium transition-colors ${
                      isOpen ? "text-primary-700" : "text-zinc-900 hover:text-primary-700"
                    }`}
                  >
                    {f.q}
                  </span>

                  <span
                    className={`ml-4 shrink-0 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "rotate-45 border-primary-300 text-primary-700"
                        : "border-secondary-300 bg-secondary-50 text-neutral-600"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-6 text-sm sm:text-base leading-relaxed text-neutral-600">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fallback contact line */}
        <p className="mt-8 text-center text-sm text-neutral-600">
          Can't find your answer?{" "}
          <a href="/login" className="font-semibold text-primary-700 hover:text-primary-800">
            Talk to our team
          </a>
        </p>
      </div>
    </section>
  );
}