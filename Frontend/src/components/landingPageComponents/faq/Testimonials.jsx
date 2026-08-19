import { Eyebrow } from "../platform/Eyebrow";

const quotes = [
  {
    q: "Streamlined our entire hiring process. The AI matching is incredibly accurate and reliable.",
    n: "HR Director",
    c: "NETTAX",
  },
  {
    q: "We found specialized medical talent 3x faster than our previous methods. A massive win.",
    n: "Head of Talent",
    c: "SILVER SURGICAL PVT LTD",
  },
  {
    q: "A game-changer for healthcare recruiting. The automated screening saves us countless hours.",
    n: "VP People",
    c: "I.B.L HEALTH CARE",
  },
  {
    q: "Perfect for sourcing top graduate talent and managing university recruitment pipelines effortlessly.",
    n: "Director",
    c: "BIC MUET",
  },
  {
    q: "Replaced multiple tools with one unified dashboard. The ROI was immediate and undeniable.",
    n: "Operations Manager",
    c: "CLICK ENTERPRISES",
  },
  {
    q: "The analytics and reporting give us unprecedented visibility into our entire talent pool.",
    n: "Managing Partner",
    c: "MN CONSULTANTS",
  },
  {
    q: "Scaling our on-site teams used to be a nightmare. Now it's a completely seamless experience.",
    n: "Recruitment Lead",
    c: "MYHC CONSTRUCTIONS",
  },
];

export function Testimonials() {
  const duplicatedQuotes = [...quotes, ...quotes];

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .testimonial-track {
          animation: marquee-right 30s linear infinite;
        }
        /* Pause the whole track the instant the pointer is over any card,
           and resume the instant it leaves — no per-card animation math
           needed since only the track itself is ever animating. */
        .testimonial-track:hover {
          animation-play-state: paused;
        }
        .mask-gradient {
          mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
        }
      `,
        }}
      />

      <section className="relative py-24 sm:py-32 overflow-hidden bg-secondary-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-12">
          <div className="max-w-3xl">
            <Eyebrow>Loved by talent teams</Eyebrow>
            <h2 className="mt-4 text-h2 tracking-tight text-zinc-900">
              Built for teams who refuse to{" "}
              <span className="text-primary-700">hire the old way.</span>
            </h2>
          </div>
        </div>

        {/* Marquee Wrapper */}
        <div className="relative flex w-full mask-gradient select-none">
          <div className="testimonial-track flex gap-6 w-max py-6">
            {duplicatedQuotes.map((q, i) => (
              <figure
                key={`${q.n}-${i}`}
                className="group relative w-[380px] h-[240px] shrink-0 flex flex-col justify-between p-6 rounded-2xl bg-secondary-50 border border-secondary-300 transition-all duration-300 hover:border-primary-400 hover:shadow-[0_8px_30px_rgba(91,33,182,0.12)] hover:-translate-y-1"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="text-primary-600"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9 7H5a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2H4v2h1a4 4 0 004-4V9a2 2 0 00-2-2zm12 0h-4a2 2 0 00-2 2v4a2 2 0 002 2h2v2a2 2 0 01-2 2h-1v2h1a4 4 0 004-4V9a2 2 0 00-2-2z" />
                  </svg>
                </div>

                {/* Card Main Body */}
                <div className="pr-8">
                  <blockquote className="text-base font-normal leading-relaxed text-zinc-900/80 group-hover:text-zinc-900 transition-colors duration-300">
                    "{q.q}"
                  </blockquote>
                </div>

                {/* Card Footer */}
                <figcaption className="mt-4 pt-4 border-t border-secondary-300 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 shrink-0 flex items-center justify-center font-semibold text-xs text-white uppercase tracking-wider shadow-inner">
                    {q.c.substring(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-sm font-semibold tracking-tight text-zinc-900 truncate">
                      {q.n}
                    </div>
                    <div className="text-xs font-medium text-neutral-600 tracking-wider uppercase mt-0.5 truncate">
                      {q.c}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}