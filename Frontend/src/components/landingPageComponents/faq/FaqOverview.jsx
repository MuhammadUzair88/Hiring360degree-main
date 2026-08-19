import { Metrics } from "./Metrics";
import { Testimonials } from "./Testimonials";
import { CTA } from "./Cta";
import { Faq } from "./Faq";
import { CTACard } from "./CtaCard";

/**
 * FaqOverview — bundles the proof + conversion + FAQ block of the landing
 * page (Metrics stat band → Testimonials → CTA → Faq → CTACard) into a
 * single section, following the same *Overview grouping pattern as
 * WorkflowOverview and PlatformOverview. Drop this straight into
 * LandingPage.jsx.
 */
export default function FaqOverview() {
  return (
    <>
      <Metrics />
      <Testimonials />
      <CTA />
      <Faq />
      <CTACard />
    </>
  );
}