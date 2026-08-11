export function formatInterviewDate(value, options = {}) {
  if (!value) return "N/A";

  const raw = String(value);
  const dateOnlyMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  let date;
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) return raw;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatInterviewTime(value) {
  if (!value) return "N/A";

  const raw = String(value).trim();
  if (/am|pm/i.test(raw)) return raw;

  const match = raw.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return raw;

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes} ${period}`;
}
