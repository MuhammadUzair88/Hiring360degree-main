export function CTA() {
  return (
    <section id="cta" className="relative py-24 sm:py-32 overflow-hidden bg-secondary-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary-800 to-primary-600 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.10)]">
          {/* Ambient glow accents, matching the brand palette */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:24px_24px]" />

          <div className="relative px-8 md:px-16 py-16 sm:py-20 text-center">
            <h2 className="text-h2 text-white mb-6">
              Ready to transform your hiring?
            </h2>
            <p className="text-lg text-primary-100 max-w-xl mx-auto mb-10">
              Join thousands of companies already using InterVue360 to build their dream teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-primary-700 hover:scale-[1.04] transition-transform shadow-2xl"
              >
                Start Free Trial
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-7 py-3.5 font-medium text-white hover:bg-white/20 transition-colors"
              >
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}