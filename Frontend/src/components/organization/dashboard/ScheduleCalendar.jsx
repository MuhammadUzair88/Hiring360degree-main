import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { scheduleCalendarMonth } from "./data";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** Builds a 42-cell (6-row) month grid, padded with the leading/trailing days of neighboring months. */
function buildMonthGrid(year, monthIndex) {
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();

  const cells = [];
  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, isCurrentMonth: true });
  }
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ day: nextDay, isCurrentMonth: false });
    nextDay += 1;
  }
  return cells;
}

/**
 * Month calendar. Month navigation (prev/next) is local state; which
 * day is selected is controlled by the parent so the schedule panels
 * rendered alongside it can read the same day. `markedDays` are
 * day-of-month numbers that get a dot — see the note on scheduleByDay
 * in data.js about why this repeats every month for now.
 */
export default function ScheduleCalendar({
  selectedDay,
  onSelectDay,
  markedDays = [],
  initialYear = scheduleCalendarMonth.year,
  initialMonthIndex = scheduleCalendarMonth.monthIndex,
  title = "Schedule",
}) {
  const [viewDate, setViewDate] = useState(new Date(initialYear, initialMonthIndex, 1));

  const grid = useMemo(
    () => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );
  const markedSet = useMemo(() => new Set(markedDays), [markedDays]);

  const goToPrevMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const goToNextMonth = () => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-slate-900 text-sm font-semibold truncate">
          <CalendarDays className="w-4 h-4 text-primary-800 shrink-0" />
          <span className="truncate">{title}</span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={goToPrevMonth}
            aria-label="Previous month"
            className="p-1.5 rounded-lg bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-zinc-600 hover:text-primary-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
            className="p-1.5 rounded-lg bg-secondary-100 outline outline-1 outline-offset-[-1px] outline-secondary-300 text-zinc-600 hover:text-primary-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="text-center text-[11px] sm:text-xs font-bold uppercase tracking-widest text-primary-800 bg-primary-50 py-1.5 rounded-lg truncate">
        {viewDate.toLocaleString("default", { month: "long" })} {viewDate.getFullYear()}
      </div>

      {/*
        gap-1 (not just gap-y) is the fix for the "crunched" tablet look:
        with no horizontal gap the 7 day columns touched edge-to-edge, so
        hover/selected backgrounds visually ran into their neighbors the
        moment the card got narrower than its desktop width.
      */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span
            key={label}
            className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-zinc-600/70 pb-1"
          >
            {label}
          </span>
        ))}

        {grid.map((cell, index) => {
          const isSelected = cell.isCurrentMonth && cell.day === selectedDay;
          const isMarked = cell.isCurrentMonth && markedSet.has(cell.day);

          return (
            <button
              key={index}
              type="button"
              disabled={!cell.isCurrentMonth}
              onClick={() => onSelectDay?.(cell.day)}
              className={`relative aspect-square min-w-0 flex items-center justify-center rounded-md sm:rounded-lg text-[11px] sm:text-xs font-semibold leading-none transition-colors ${
                !cell.isCurrentMonth
                  ? "text-secondary-400 cursor-default"
                  : isSelected
                  ? "bg-primary-800 text-secondary-50 shadow-sm"
                  : "text-slate-900 hover:bg-primary-50"
              }`}
            >
              {cell.day}
              {isMarked && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary-700" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}