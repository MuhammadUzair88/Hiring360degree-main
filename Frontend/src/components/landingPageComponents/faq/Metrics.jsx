const items = [
  { v: "3x", l: "Faster Time-to-Hire" },
  { v: "90%", l: "Screening Accuracy" },
  { v: "24/7", l: "Automated Pipeline" },
  { v: "10K+", l: "Active Teams" },
];

/**
 * Metrics — full-bleed stat band.
 * Uses the primary-900 → primary-700 brand gradient from index.css so it
 * reads as a deliberate "banner" moment between sections, not another card.
 * Dividers are subtle (white/20) rather than a hard rule, since the
 * gradient itself already does the work of separating this from the page.
 */
export function Metrics() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-r from-primary-900 to-primary-700 overflow-hidden">
      {/* Faint dot grid so the band isn't a flat color field */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10">
          {items.map((m, i) => (
            <div
              key={m.l}
              className={`flex flex-col items-center text-center px-6 ${
                i > 0 ? "lg:border-l lg:border-white/20" : ""
              }`}
            >
              <div className="text-h1 font-semibold text-white leading-none tracking-tight">
                {m.v}
              </div>
              <div className="mt-3 text-sm text-white/80">{m.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}