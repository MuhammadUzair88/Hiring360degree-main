import { pipelineInputs, pipelineOutputs, icons } from "./Intelligencedata";

const { Sparkles } = icons;

/**
 * Visualizes the AI engine as a pipeline: raw resume data flows in on the
 * left, gets processed by a pulsing AI core in the center, and comes out
 * as structured hiring signals on the right.
 *
 * Motion is all pure CSS (see intelligence-animations.css) — no animation
 * library needed, and everything respects prefers-reduced-motion.
 */
export default function IntelligencePipeline() {
  return (
    <div className="intel-stagger-2 w-full bg-secondary-50 rounded-xl shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] outline outline-1 outline-offset-[-1px] outline-secondary-300 p-8 sm:p-12 lg:p-16 overflow-hidden">
      <div className="relative max-w-[880px] mx-auto">
        {/* Animated dashed connectors — desktop only, purely decorative */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 880 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="intel-flow-line stroke-primary-600"
            d="M 250 130 Q 310 130 355 130"
            fill="none"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            className="intel-flow-line stroke-primary-600"
            d="M 525 130 Q 570 130 630 130"
            fill="none"
            strokeWidth="1.5"
            opacity="0.5"
            style={{ animationDelay: "0.5s" }}
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-10 md:gap-8 items-center">
          {/* Raw data in */}
          <div className="flex flex-col gap-4 order-2 md:order-1">
            {pipelineInputs.map(({ icon: Icon, label, value }, i) => (
              <div
                key={label}
                className={`intel-stagger-${i + 1} w-full md:ml-auto md:w-60 p-4 bg-secondary-50 rounded-lg shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-3 md:flex-row-reverse md:text-right transition-shadow hover:shadow-[0px_8px_28px_0px_rgba(91,33,182,0.14)]`}
              >
                <Icon className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-zinc-500 text-xs font-medium tracking-wide">
                    {label}
                  </p>
                  <p className="text-zinc-900 text-base font-semibold leading-6">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI engine, center — pulsing core */}
          <div className="relative w-32 h-32 mx-auto flex items-center justify-center order-1 md:order-2 z-10">
            <div className="intel-pulse-ring absolute inset-0 m-auto w-20 h-20 rounded-full border-2 border-primary-600/40" />
            <div
              className="intel-pulse-ring absolute inset-0 m-auto w-20 h-20 rounded-full border-2 border-primary-600/40"
              style={{ animationDelay: "0.8s" }}
            />
            <div className="w-20 h-20 bg-secondary-50 rounded-full shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] outline outline-1 outline-offset-[-1px] outline-primary-600/30 flex flex-col items-center justify-center gap-1">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span className="text-primary-600 text-[10px] font-semibold text-center leading-tight">
                AI
                <br />
                Analysis
              </span>
            </div>
          </div>

          {/* Structured signals out */}
          <div className="flex flex-col gap-4 order-3">
            {pipelineOutputs.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                className={`intel-stagger-${i + 1} w-full md:w-60 p-3 bg-primary-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-600/20 flex items-center gap-3 transition-colors hover:bg-primary-100/60`}
              >
                <Icon className="w-4 h-4 text-primary-600 shrink-0" />
                <span className="text-zinc-900 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}