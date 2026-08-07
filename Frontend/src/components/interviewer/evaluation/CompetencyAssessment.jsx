// src/components/interviewerDashboard/evaluation/CompetencyAssessment.jsx

import React, { useState } from "react";
import { Star } from "lucide-react";

function RatingRow({ category, value, onChange, readOnly }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3.5 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{category.label}</p>
        <p className="text-xs text-gray-500">{category.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= display;
            return (
              <button
                key={star}
                type="button"
                disabled={readOnly}
                onClick={() => onChange(category.id, star)}
                onMouseEnter={() => !readOnly && setHovered(star)}
                onMouseLeave={() => !readOnly && setHovered(0)}
                className={`p-0.5 transition-colors focus:outline-none ${
                  readOnly ? "cursor-default" : "cursor-pointer"
                }`}
                aria-label={`Rate ${category.label} ${star} out of 5`}
              >
                <Star
                  size={18}
                  className={isFilled ? "text-primary-600 fill-current" : "text-slate-300"}
                />
              </button>
            );
          })}
        </div>
        <span className="text-xs font-semibold text-primary-800 w-4 text-center">
          {value > 0 ? value : "-"}
        </span>
      </div>
    </div>
  );
}

export default function CompetencyAssessment({ categories, ratings, onRatingChange, readOnly }) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-slate-900">Competency Assessment</h3>

      <div className="flex flex-col">
        {categories.map((category) => (
          <RatingRow
            key={category.id}
            category={category}
            value={ratings[category.id] || 0}
            onChange={onRatingChange}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}
