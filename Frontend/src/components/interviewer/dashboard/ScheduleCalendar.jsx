import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

function localDateKey(year, monthIndex, day) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function selectedDateKey(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  return localDateKey(value.getFullYear(), value.getMonth(), value.getDate());
}

export default function ScheduleCalendar({
  selectedDate,
  onSelectDate,
  markedDates = [],
  initialYear = new Date().getFullYear(),
  initialMonthIndex = new Date().getMonth(),
  title = "Schedule",
}) {
  const [viewDate, setViewDate] = useState(
    () => new Date(initialYear, initialMonthIndex, 1)
  );

  const grid = useMemo(
    () => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const markedSet = useMemo(() => new Set(markedDates.filter(Boolean)), [markedDates]);
  const activeDateKey = selectedDateKey(selectedDate);

  const goToPrevMonth = () =>
    setViewDate((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));

  const goToNextMonth = () =>
    setViewDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));

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
          const key = cell.isCurrentMonth
            ? localDateKey(viewDate.getFullYear(), viewDate.getMonth(), cell.day)
            : "";
          const isSelected = Boolean(key && key === activeDateKey);
          const isMarked = Boolean(key && markedSet.has(key));

          return (
            <button
              key={`${cell.isCurrentMonth ? "current" : "padding"}-${index}-${cell.day}`}
              type="button"
              disabled={!cell.isCurrentMonth}
              onClick={() => {
                if (!cell.isCurrentMonth) return;
                onSelectDate?.(
                  new Date(viewDate.getFullYear(), viewDate.getMonth(), cell.day)
                );
              }}
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
