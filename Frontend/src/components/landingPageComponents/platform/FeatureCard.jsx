import { useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { ICONS } from "./Icons";

const SPRING = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * FeatureCard.jsx — single platform feature card.
 *
 * Hover is now fully self-contained: each card owns its own `isHovered`
 * state instead of receiving it from the parent. This is the key fix
 * for the "all cards transition on hover" bug — when hover state lived
 * in PlatformOverview, hovering ONE card re-rendered ALL SIX cards
 * (new inline style objects, new transitionDelay, etc.), which made
 * every sibling appear to animate too. Now a hover only ever touches
 * the one <article> the mouse is actually on.
 */
export function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const { title, desc, icon, accent } = feature;
  const Icon = ICONS[icon];

  return (
    <article
      className="reveal group relative rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={title}
      style={{
        transitionDelay: `${(index % 3) * 50}ms`,
        height: "350px",
      }}
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 z-0 border rounded-2xl"
        style={{
          transition: "background-color 0.5s ease, border-color 0.5s ease",
          backgroundColor: isHovered ? accent : "var(--card, #ffffff)",
          borderColor: isHovered ? "transparent" : "rgba(0,0,0,0.08)",
        }}
      />

      {/* Inline logo watermark */}
      <div
        className="absolute z-0 pointer-events-none"
        aria-hidden
        style={{
          width: "140px",
          height: "140px",
          transition: SPRING,
          left: isHovered ? "50%" : "24px",
          top: isHovered ? "50%" : "calc(100% - 24px)",
          transform: isHovered
            ? "translate(-50%, -50%) scale(3.2) rotate(-5deg)"
            : "translate(0, -100%) scale(1.1) rotate(0deg)",
          opacity: isHovered ? 0.12 : 0.6,
          color: isHovered ? "#ffffff" : accent,
        }}
      >
        <BrandLogo className="w-full h-full" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 p-6 flex flex-col h-full pointer-events-none"
        style={{
          transition: SPRING,
          transform: isHovered ? "translateY(-12px)" : "translateY(0px)",
        }}
      >
        <div className="mb-4">
          <Icon
            size={24}
            color={isHovered ? "#fff" : "var(--foreground, #111)"}
            style={{ transition: "color 0.3s ease" }}
          />
        </div>

        <h3
          className="font-display mt-2 text-xl tracking-tight transition-colors duration-300"
          style={{ color: isHovered ? "#fff" : "var(--foreground, #111)" }}
        >
          {title}
        </h3>

        <p
          className="mt-2 text-sm leading-relaxed transition-colors duration-300"
          style={{
            color: isHovered
              ? "rgba(255,255,255,0.85)"
              : "var(--muted-foreground, #555)",
          }}
        >
          {desc}
        </p>
      </div>
    </article>
  );
}