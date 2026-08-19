import { cta } from "./Intelligencedata";

const { icon: Icon, label } = cta;

export default function IntelligenceCTA() {
  return (
    <div className="intel-stagger-4 flex flex-col items-center">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:-translate-y-0.5 transition-all duration-200 rounded-full shadow-[0px_4px_20px_0px_rgba(91,33,182,0.08)] hover:shadow-[0px_8px_28px_0px_rgba(91,33,182,0.2)] text-secondary-50 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-800 focus-visible:ring-offset-2"
      >
        <Icon className="w-4 h-4 fill-secondary-50" />
        {label}
      </button>
    </div>
  );
}