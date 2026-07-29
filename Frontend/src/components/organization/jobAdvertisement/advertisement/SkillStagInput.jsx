import React, { useState } from "react";
import { X } from "lucide-react";

/**
 * Chip/tag input for the Required Skills field. Type a skill, press
 * Enter or "," (or just blur the field) to add it as a chip; Backspace
 * on an empty draft removes the last chip. `skills` is a plain string
 * array so it serializes straight onto the Advertisement schema's
 * `skills: [String]` field with no transformation needed.
 */
export default function SkillsTagInput({ id, skills = [], onChange, placeholder = "Add a skill and press Enter" }) {
  const [draft, setDraft] = useState("");

  const addSkill = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft("");
      return;
    }
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setDraft("");
  };

  const removeSkill = (skill) => {
    onChange(skills.filter((existing) => existing !== skill));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    } else if (event.key === "Backspace" && !draft && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="w-full min-h-[3.25rem] px-3 py-2.5 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-primary-300 transition-colors">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full bg-primary-800 text-white text-xs font-semibold"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            aria-label={`Remove ${skill}`}
            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={skills.length === 0 ? placeholder : ""}
        className="flex-1 min-w-32 bg-transparent outline-none text-sm text-slate-900 placeholder:text-gray-500 py-1"
      />
    </div>
  );
}