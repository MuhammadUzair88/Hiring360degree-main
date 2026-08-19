/**
 * CTACard — same structure and copy as the reference CTA, reskinned to the
 * primary-purple theme (index.css tokens) instead of the black/oklch glass
 * treatment. Keeps its own small <style> block for the glow keyframes so it
 * stays self-contained and doesn't require any global CSS additions.
 */
export function CTACard() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes cta-pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.08); }
        }
        .animate-cta-pulse-glow {
          animation: cta-pulse-glow 4s ease-in-out infinite;
        }
      `,
        }}
      />

      <section id="cta-card" className="relative py-32 overflow-hidden bg-secondary-50">
        <div className="container mx-auto px-6">
          <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-primary-700 opacity-95" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] bg-[length:24px_24px]" />
            <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-cta-pulse-glow" />
            <div
              className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl animate-cta-pulse-glow"
              style={{ animationDelay: "1.5s" }}
            />

            <div className="relative px-8 md:px-16 py-20 text-center">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white mb-6">
                Hire like it's <span className="italic">2030.</span>
              </h2>
              <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
                Join the teams replacing six tools with one autonomous hiring brain. Setup in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-primary-700 hover:scale-[1.04] transition-transform shadow-2xl"
                >
                  Start free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur px-7 py-3.5 font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}