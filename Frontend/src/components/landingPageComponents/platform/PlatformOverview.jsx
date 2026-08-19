import { Eyebrow } from "./Eyebrow";
import { FeatureCard } from "./FeatureCard";
import { BrandLogo } from "./BrandLogo";
import {
  platformEyebrow,
  platformHeading,
  platformSubheading,
  platformTrustLine,
  platformFeatures,
} from "./data";

/**
 * PlatformOverview.jsx — the "Platform" landing-page section.
 *
 * No longer owns any hover state — each FeatureCard manages its own
 * hover locally now, so this component is purely a layout/data pass-
 * through. That also means hovering one card can never trigger a
 * re-render (and therefore never trigger a stray transition) on any
 * of its siblings.
 */
export default function PlatformOverview() {
  return (
    <section id="platform" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl reveal">
          <Eyebrow>{platformEyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            {platformHeading.prefix}{" "}
            <span className="text-primary-600">{platformHeading.highlight}</span>
          </h2>
          <p className="mt-5 text-muted-foreground max-w-2xl leading-relaxed">
            {platformSubheading}
          </p>
        </div>

        {/* Card grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>

        {/* Bottom brand strip */}
        <div className="mt-16 flex items-center justify-center gap-3 reveal">
          <BrandLogo className="h-7 w-auto opacity-40 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{platformTrustLine}</span>
        </div>
      </div>
    </section>
  );
}