// src/components/LandingPage/Workflow/WorkflowOverview.jsx
//
// The only file pages/LandingPage.jsx needs to import. Renders the hero,
// the scroll-spy tabs, all five feature cards (alternating left/right by
// `side` in data.js), the integrations strip, and the security section.
//
// Usage in pages/LandingPage.jsx:
//   import { WorkflowOverview } from "../components/LandingPage/Workflow/WorkflowOverview";
//   ...
//   <WorkflowOverview />
//
// The Navbar's "Workflow" link points at href="#workflow", which matches
// the id on the outer <section> below.

import { WorkflowHero } from "./WorkflowHero";
import { WorkflowTabs } from "./WorkflowTabs";
import { WorkflowFeatureCardRight } from "./WorkflowFeatureCardRight";
import { WorkflowFeatureCardLeft } from "./WorkflowFeatureCardLeft";
import { WorkflowIntegrations } from "./WorkflowIntegrations";
import { WorkflowSecurity } from "./WorkflowSecurity";
import { workflowFeatures } from "./data";

export function WorkflowOverview() {
  return (
    <section id="workflow" className="scroll-mt-24 bg-secondary-50 sm:scroll-mt-28">
      <WorkflowHero />
      <WorkflowTabs />

      {workflowFeatures.map((feature) =>
        feature.side === "left" ? (
          <WorkflowFeatureCardLeft key={feature.id} feature={feature} />
        ) : (
          <WorkflowFeatureCardRight key={feature.id} feature={feature} />
        )
      )}

      {/* <WorkflowIntegrations />
      <WorkflowSecurity /> */}
    </section>
  );
}

export default WorkflowOverview;