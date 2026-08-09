

import { Clock, Video, CheckCircle2, AlertCircle, CalendarRange } from "lucide-react";

export const STATUS_TONE = {
  Upcoming: {
    label: "Upcoming",
    icon: Clock,
    badge: "bg-primary-50 text-primary-700 outline-primary-200",
    dot: "bg-primary-500",
    solid: "bg-primary-600",
    iconBadge: "bg-primary-50 text-primary-700",
  },
  Ongoing: {
    label: "Live Now",
    icon: Video,
    badge: "bg-primary-800 text-secondary-50 outline-primary-800",
    dot: "bg-secondary-50",
    solid: "bg-primary-800",
    iconBadge: "bg-primary-800 text-secondary-50",
  },
  Completed: {
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-primary-100 text-primary-800 outline-primary-300",
    dot: "bg-primary-700",
    solid: "bg-primary-700",
    iconBadge: "bg-primary-100 text-primary-800",
  },
  "No Show": {
    label: "No Show",
    icon: AlertCircle,
    badge: "bg-secondary-200 text-black/60 outline-secondary-300",
    dot: "bg-black/40",
    solid: "bg-black/40",
    iconBadge: "bg-secondary-200 text-black/60",
  },
};

export const TOTAL_TONE = {
  label: "Total Dossiers",
  icon: CalendarRange,
  iconBadge: "bg-primary-50 text-primary-800",
};

export function getStatusTone(status) {
  return STATUS_TONE[status] || STATUS_TONE.Upcoming;
}