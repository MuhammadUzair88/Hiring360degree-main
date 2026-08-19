import { Sparkles, Megaphone, Users, CalendarClock, FileText } from "lucide-react";

/**
 * Sidebar for the hero's dashboard mockup — mirrors the real app's
 * job-scoped SecondarySidebar, but scaled down to live inside the mockup.
 *
 * Layout: fills its parent grid cell completely (h-full w-full) so it
 * always matches the 25% column the grid gives it — no fixed pixel
 * widths, no gaps, no overlap with the image cell next to it.
 *
 * Responsive behavior:
 * - Mobile (<sm): collapses to a horizontal icon strip along the TOP of
 *   the card, above the screenshot.
 * - sm and up: full vertical rail with labels + the brand row.
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
      className="flex h-full w-full shrink-0 items-center gap-1 border-b border-secondary-300 bg-secondary-50 px-2 py-2
                 sm:flex-col sm:items-stretch sm:gap-2.5 sm:border-b-0 sm:border-r sm:px-2 sm:py-3"
    >
      {/* Brand row */}
      <div className="hidden items-center gap-1.5 sm:flex">
        <Sparkles size={13} className="shrink-0 text-primary-700" />
        <span className="truncate text-[10px] font-semibold text-zinc-900">
          Sr. Product Designer
        </span>
      </div>

      <div className="hidden border-t border-secondary-300 sm:block" />

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
              <span className="truncate text-[9px] font-medium">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}