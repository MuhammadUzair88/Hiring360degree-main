/**
 * src/components/landingPageComponents/platform/PlatformCard.jsx
 *
 * One tile in the Platform feature grid. Purely presentational: every
 * piece of copy and the icon component arrive as props from
 * PlatformOverview, which reads them from ./data.js. This component owns
 * no data of its own, so it can be reused for any future feature grid
 * just by passing different props.
 *
 * Hover/focus is tracked by the *parent* (PlatformOverview) rather than
 * locally, because the parent also needs to dim sibling cards while one
 * is active — that cross-card behavior can't live inside a single card.
 */
export default function PlatformCard({
  title,
  description,
  Icon,
  index = 0,
  isActive = false,
  isDimmed = false,
  onActivate,
  onDeactivate,
}) {
  return (
    <article
      role="group"
      aria-label={title}
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={[
        "reveal group relative flex h-full flex-col rounded-2xl border p-6",
        "bg-secondary-50 transition-[opacity,border-color,box-shadow] duration-300 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2",
        isActive
          ? "border-primary-600 shadow-[0_20px_45px_-28px_var(--color-primary-600)]"
          : "border-secondary-300 shadow-none",
        isDimmed ? "opacity-60" : "opacity-100",
      ].join(" ")}
      style={{ transitionDelay: `${(index % 3) * 40}ms` }}
    >
      {/* Icon badge */}
      <span
        className={[
          "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl",
          "transition-colors duration-300",
          isActive ? "bg-primary-600" : "bg-primary-100",
        ].join(" ")}
        aria-hidden="true"
      >
        <Icon size={20} color={isActive ? "#ffffff" : "var(--color-primary-700)"} />
      </span>

      <h3 className="text-h6 text-foreground">{title}</h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* "Learn more" affordance — revealed on hover/focus */}
      <span
        className={[
          "mt-auto flex items-center gap-1.5 pt-6 text-sm font-medium text-primary-700",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
        ].join(" ")}
      >
        Learn more
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </article>
  );
}