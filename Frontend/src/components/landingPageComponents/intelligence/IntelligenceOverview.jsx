import "./Intelligenceanimations.css";
import IntelligenceHeader from "./IntelligenceHeader";
import IntelligencePipeline from "./IntelligencePipeline";
import CandidateMatchShowcase from "./CandidateMatchShowcase";
import IntelligenceCTA from "./IntelligenceCta";

/**
 * Full "Intelligence" section of the landing page.
 * Mount this in LandingPage.jsx the same way PlatformOverview,
 * WorkflowOverview, and FaqOverview are mounted:
 *
 *   import IntelligenceOverview from "../../components/landingPageComponents/intelligence/IntelligenceOverview";
 *   ...
 *   <PlatformOverview />
 *   <WorkflowOverview />
 *   <IntelligenceOverview />
 *   <FaqOverview />
 */
export default function IntelligenceOverview() {
  return (
    <section id="intelligence" className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12 py-24 flex flex-col items-center gap-16">
      <IntelligenceHeader />
      <IntelligencePipeline />
      <CandidateMatchShowcase />
      <IntelligenceCTA />
    </section>
  );
}
