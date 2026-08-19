// // import { Navbar } from "../../components/landingPageComponents/Navbar";
// // import { Footer } from "../../components/landingPageComponents/Footer";
// // import { Hero } from "../../components/landingPageComponents/hero/HEro";
// // import WorkflowHero from "../../components/landingPageComponents/workflow/WorkflowHero";
// // import WorkflowOverview from "../../components/landingPageComponents/workflow/WorkflowOverview";

// // /**
// //  * Public marketing landing page — mounted at "/" in App.jsx.
// //  * Sections are intentionally split into their own folders
// //  * (platform/, workflow/, intelligence/, services/) so each one can grow
// //  * its own sub-components later without crowding this file.
// //  *
// //  * `app-navbar-offset` (defined once in index.css) pushes this content
// //  * below the fixed Navbar — without it, Hero renders partially underneath
// //  * the navbar instead of clearly below it.
// //  *
// //  * The backdrop below is fixed to the viewport and spans the FULL page
// //  * width regardless of how wide the screen is, so every section shares one
// //  * continuous background treatment instead of each section's own centered
// //  * max-w container leaving flat, empty gutters on ultra-wide monitors.
// //  */
// // export default function LandingPage() {
// //   return (
// //     <div className="relative min-h-screen overflow-x-hidden bg-secondary-50 antialiased">
// //       {/* Page-wide backdrop — sits behind every section */}
// //       <div className="pointer-events-none fixed inset-0 -z-10">
// //         <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
// //         <div className="absolute left-1/4 top-[900px] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary-50 blur-3xl" />
// //         <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-primary-200)_1px,transparent_1px)] bg-[length:28px_28px] opacity-20" />
// //       </div>

// //       <Navbar />
// //       <main className="app-navbar-offset relative">
// //         <Hero />
// //         <WorkflowOverview/>
// //         {/* Platform, Services, Workflow, Intelligence sections go here */}
// //       </main>
      
// //     </div>
// //   );
// // }


// import { Navbar } from "../../components/landingPageComponents/Navbar";
// import { Footer } from "../../components/landingPageComponents/Footer";
// import { Hero } from "../../components/landingPageComponents/hero/HEro";
// import WorkflowHero from "../../components/landingPageComponents/workflow/WorkflowHero";
// import WorkflowOverview from "../../components/landingPageComponents/workflow/WorkflowOverview";
// import PlatformOverview from "../../components/landingPageComponents/platform/PlatformOverview";
// import FaqOverview from "../../components/landingPageComponents/faq/FaqOverview";
// import IntelligenceOverview from "../../components/landingPageComponents/intelligence/IntelligenceOverview";
// import HeroOverview from "../../components/landingPageComponents/hero/HeroOverview";

// /**
//  * Public marketing landing page — mounted at "/" in App.jsx.
//  * Sections are intentionally split into their own folders
//  * (platform/, workflow/, intelligence/, services/) so each one can grow
//  * its own sub-components later without crowding this file.
//  *
//  * `app-navbar-offset` (defined once in index.css) pushes this content
//  * below the fixed Navbar — without it, Hero renders partially underneath
//  * the navbar instead of clearly below it.
//  *
//  * The backdrop below is fixed to the viewport and spans the FULL page
//  * width regardless of how wide the screen is, so every section shares one
//  * continuous background treatment instead of each section's own centered
//  * max-w container leaving flat, empty gutters on ultra-wide monitors.
//  */
// export default function LandingPage() {
//   return (
//     <div className="relative min-h-screen overflow-x-hidden bg-secondary-50 antialiased">
//       {/* Page-wide backdrop — sits behind every section */}
//       <div className="pointer-events-none fixed inset-0 -z-10">
//         <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
//         <div className="absolute left-1/4 top-[900px] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary-50 blur-3xl" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-primary-200)_1px,transparent_1px)] bg-[length:28px_28px] opacity-20" />
//       </div>

//       <Navbar />
//       <main className="app-navbar-offset relative">
//         <Hero />
//         <PlatformOverview />
//         <WorkflowOverview />
//         <IntelligenceOverview />
//         <FaqOverview />
//         {/* Services, Intelligence sections go here */}
//       </main>

//       <Footer />
//     </div>
//   );
// }

import { Navbar } from "../../components/landingPageComponents/Navbar";
import { Footer } from "../../components/landingPageComponents/Footer";
import HeroOverview from "../../components/landingPageComponents/hero/HeroOverview";
import WorkflowOverview from "../../components/landingPageComponents/workflow/WorkflowOverview";
import PlatformOverview from "../../components/landingPageComponents/platform/PlatformOverview";
import FaqOverview from "../../components/landingPageComponents/faq/FaqOverview";
import IntelligenceOverview from "../../components/landingPageComponents/intelligence/IntelligenceOverview";

/**
 * Public marketing landing page — mounted at "/" in App.jsx.
 * Sections are intentionally split into their own folders
 * (platform/, workflow/, intelligence/, services/) so each one can grow
 * its own sub-components later without crowding this file.
 *
 * `app-navbar-offset` (defined once in index.css) pushes this content
 * below the fixed Navbar — without it, Hero renders partially underneath
 * the navbar instead of clearly below it.
 *
 * The backdrop below is fixed to the viewport and spans the FULL page
 * width regardless of how wide the screen is, so every section shares one
 * continuous background treatment instead of each section's own centered
 * max-w container leaving flat, empty gutters on ultra-wide monitors.
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-secondary-50 antialiased">
      {/* Page-wide backdrop — sits behind every section */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute left-1/4 top-[900px] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-primary-50 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-primary-200)_1px,transparent_1px)] bg-[length:28px_28px] opacity-20" />
      </div>

      <Navbar />
      <main className="app-navbar-offset relative">
        <HeroOverview />
        <PlatformOverview />
        <WorkflowOverview />
        <IntelligenceOverview />
        <FaqOverview />
      </main>

      <Footer />
    </div>
  );
}