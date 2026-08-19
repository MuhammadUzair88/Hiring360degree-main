import { sectionIntro } from "./Intelligencedata";

/**
 * Eyebrow + heading + supporting copy for the Intelligence section.
 * Heading uses the project's h2 token (see index.css @theme) rather than
 * an arbitrary text size, so it stays in sync with every other section
 * heading across the app.
 */
export default function IntelligenceHeader() {
  return (
    <div className="intel-stagger-1 w-full max-w-[768px] mx-auto flex flex-col items-center gap-4 text-center">
      <span className="text-primary-600 text-xs font-medium uppercase tracking-wide">
        {sectionIntro.eyebrow}
      </span>

      <h2 className="text-zinc-900">
        {sectionIntro.headingLines[0]}
        <br />
        {sectionIntro.headingLines[1]}
      </h2>

      <p className="text-neutral-600 text-lg leading-7 max-w-[620px]">
        {sectionIntro.description}
      </p>
    </div>
  );
}