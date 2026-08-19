
/**
 * Sidebar for the hero's dashboard mockup — mirrors the real app's
 * job-scoped SecondarySidebar, but scaled down to live inside the mockup.
 *
 * Responsive behavior:
 * - Mobile   (<sm): collapses to a horizontal icon strip along the TOP of
 *   the card, above the screenshot — there's no room for a side rail once
 *   the card itself is only a few hundred px wide.
 * - Tablet   (sm–md): becomes a narrow vertical icon-only rail on the left.
 * - Desktop  (md+): full vertical rail with labels + the brand row.
 */
const NAV_ITEMS = [
  { key: "overview", label: "Overview", icon: Megaphone },
  { key: "candidates", label: "Candidates", icon: Users },
  { key: "rounds", label: "Rounds", icon: CalendarClock },
  { key: "offer", label: "Offer Letter", icon: FileText },
];

export function Sidebar({ activeKey, onSelect }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1 border-b border-secondary-300 bg-secondary-50 px-2 py-2
                 sm:w-14 sm:flex-col sm:items-stretch sm:gap-2.5 sm:border-b-0 sm:border-r sm:px-2 sm:py-3
                 md:w-40 md:px-3"
    >
      {/* Brand row — only shows once there's room for the label (md+) */}
      <div className="hidden items-center gap-1.5 md:flex">
        <Sparkles size={13} className="shrink-0 text-primary-700" />
        <span className="truncate text-[10px] font-semibold text-zinc-900">
          Sr. Product Designer
        </span>
      </div>

      <div className="hidden border-t border-secondary-300 md:block" />

      <div className="flex flex-1 items-center gap-1 sm:flex-col sm:items-stretch">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = key === activeKey;
          return (
            <button
              key={key}
              type="button"
              title={label}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onSelect(key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 transition-colors
                          sm:flex-none sm:justify-start
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-1
                          ${
                            isActive
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-500 hover:bg-secondary-100 hover:text-zinc-900"
                          }`}
            >
              <Icon size={13} strokeWidth={2.25} className="shrink-0" />
              <span className="hidden truncate text-[9px] font-medium md:inline">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}