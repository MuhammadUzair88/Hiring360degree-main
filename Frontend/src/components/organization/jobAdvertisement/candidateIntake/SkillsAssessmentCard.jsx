import React from "react";
import { CheckCircle2 } from "lucide-react";

const GROUP_TONES = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
  neutral: "bg-amber-50 text-amber-700 border-amber-200",
  additional: "bg-primary-800/5 text-primary-800 border-primary-800/20",
};

function SkillGroup({ title, tone, items, emptyText }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wide">
        {title} ({items.length})
      </span>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${GROUP_TONES[tone]}`}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium w-fit ${GROUP_TONES.positive}`}>{emptyText}</span>
      )}
    </div>
  );
}

export default function SkillsAssessmentCard({ skills }) {
  if (!skills) return null;
  const { qualified = [], gaps = [], additional = [] } = skills;

  return (
    <section className="flex flex-col gap-4">
      <h3 className="flex items-center gap-2 text-slate-900 text-sm font-semibold">
        <CheckCircle2 className="w-4 h-4 text-primary-800" />
        Skills Assessment
      </h3>

      <div className="flex flex-col gap-4">
        <SkillGroup title="Qualified" tone="positive" items={qualified} emptyText="No qualified skills matched" />
        <SkillGroup title="Gaps" tone="neutral" items={gaps} emptyText="No skill gaps" />
        {additional.length > 0 && <SkillGroup title="Additional" tone="additional" items={additional} emptyText="" />}
      </div>
    </section>
  );
}