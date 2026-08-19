/**
 * Eyebrow.jsx — small uppercase label with a brand-gradient tick,
 * used above section headings.
 */
export function Eyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
      <span className="bg-primary-500 h-px w-8 bg-gradient-brand" />
      {children}
    </div>
  );
}