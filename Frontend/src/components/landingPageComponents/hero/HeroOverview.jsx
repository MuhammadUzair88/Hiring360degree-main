// HeroOverview.jsx

import { useState } from "react";
import { heroData } from "./data";
import { LogoMarquee } from "./LogoMarquee";
import { Sidebar } from "./Sidebar";
import { SCREENS } from "./screens";

function renderHeadline(headline) {
  const { lines, highlight } = headline;

  return lines.map((line, i) => {
    const words = line.split(" ");

    return (
      <span key={i} className="block">
        {words.map((word, j) => {
          const cleanWord = word.replace(/[.,!?]/g, "");
          const isHighlight = cleanWord === highlight;

          return (
            <span
              key={j}
              className={
                isHighlight ? "text-primary-500" : "text-zinc-900"
              }
            >
              {word}
              {j < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </span>
    );
  });
}

export default function HeroOverview({
  badge = heroData.badge,
  headline = heroData.headline,
  description = heroData.description,
  primaryCta = heroData.primaryCta,
  secondaryCta = heroData.secondaryCta,
  footnote = heroData.footnote,
}) {
  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="
            mx-auto grid w-full max-w-[1280px] grid-cols-1
            items-center gap-10 px-4 pt-16 pb-16
            sm:px-6 sm:pt-24 sm:pb-24
            lg:grid-cols-5 lg:gap-12 lg:px-12 lg:pt-24 lg:pb-32
          "
        >
          {/* LEFT — Hero Content */}
          <div
            className="
              flex flex-col items-center text-center
              lg:col-span-2 lg:items-start lg:text-left
            "
          >
            {/* Badge */}
            <div className="flex items-center rounded-full bg-primary-50 px-4 py-1.5">
              <span className="font-sans text-xs font-semibold leading-3 tracking-wide text-primary-600">
                {badge}
              </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col items-center pt-6 lg:items-start">
              <h1 className="font-sans text-h1 leading-[1.1] sm:leading-[1.15]">
                {renderHeadline(headline)}
              </h1>
            </div>

            {/* Description */}
            <div
              className="
                flex max-w-[512px] flex-col items-center
                pt-6 lg:items-start
              "
            >
              <p className="font-sans text-base font-normal leading-7 text-neutral-600 sm:text-lg">
                {description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex w-full flex-col items-center pt-6 lg:items-start">
              <div
                className="
                  flex w-full flex-col gap-4 pt-4
                  sm:w-auto sm:flex-row sm:items-start
                "
              >
                {/* Primary CTA */}
                <a
                  href={primaryCta.href}
                  className="
                    w-full rounded-lg bg-primary-700
                    px-8 py-3 text-center
                    shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)]
                    transition-colors hover:bg-primary-800
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary-800
                    focus-visible:ring-offset-2
                    sm:w-auto
                  "
                >
                  <span className="font-sans text-base font-normal leading-6 text-secondary-50">
                    {primaryCta.label}
                  </span>
                </a>

                {/* Secondary CTA */}
                <a
                  href={secondaryCta.href}
                  className="
                    flex w-full items-center justify-center
                    gap-2 rounded-lg px-8 py-3
                    outline outline-1 outline-offset-[-1px]
                    outline-zinc-500
                    transition-colors hover:bg-secondary-200
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary-800
                    focus-visible:ring-offset-2
                    sm:w-auto
                  "
                >
                  <span className="font-sans text-base font-normal leading-6 text-zinc-900">
                    {secondaryCta.label}
                  </span>
                </a>
              </div>
            </div>

            {/* Footnote */}
            <div className="flex flex-col items-center pt-6 lg:items-start">
              <span className="font-sans text-xs font-medium leading-3 tracking-wide text-zinc-500">
                {footnote}
              </span>
            </div>
          </div>

          {/* RIGHT — Dashboard Preview */}
          <div className="relative w-full min-w-0 lg:col-span-3">
            <DashboardPreview />
          </div>
        </div>
      </section>

      <LogoMarquee />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* DASHBOARD PREVIEW                                                          */
/* -------------------------------------------------------------------------- */

function DashboardPreview() {
  const [activeKey, setActiveKey] = useState("overview");
  const screen = SCREENS[activeKey];

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gradient-to-l from-primary-100 to-primary-50 opacity-60 blur-[64px]"
      />

      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-secondary-50 shadow-[0px_4px_20px_0px_rgba(91,33,182,0.15)]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 self-stretch border-b border-secondary-300 bg-secondary-100 px-4 py-3">
          <div className="h-3 w-3 shrink-0 rounded-full bg-danger-500/50" />
          <div className="h-3 w-3 shrink-0 rounded-full bg-warning-500/50" />
          <div className="h-3 w-3 shrink-0 rounded-full bg-success-500/50" />
          <div className="min-w-0 flex-1 truncate text-center font-mono text-[11px] text-gray-500">
            {screen.title}
          </div>
        </div>

        {/*
          No fixed height anymore. The row's height is driven by the IMAGE's
          own aspect ratio (aspect-video below), so the box always matches
          the screenshot's real proportions — no crop, no zoom, no gaps.
          Sidebar still locks to exactly 1/4 (25%) of the width via
          grid-cols-4 + col-span-1, independent of height.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-4">
          <div className="border-b border-secondary-300 sm:col-span-1 sm:border-b-0 sm:border-r">
            <Sidebar activeKey={activeKey} onSelect={setActiveKey} />
          </div>

          <div className="aspect-video w-full bg-secondary-100 sm:col-span-3">
            <img
              key={activeKey}
              className="h-full w-full object-cover object-top"
              src={screen.image}
              alt={screen.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}