import React from "react";
import { Link } from "react-router-dom";

/** One shortcut button/link inside QuickActionsPanel. */
export default function QuickActionButton({ label, icon: Icon, to = "" }) {
  return (
    <Link
      to={to}
      className="self-stretch px-3 py-3 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-3 text-slate-900 text-sm hover:bg-secondary-200 transition-colors"
    >
      {Icon && <Icon className="w-4 h-4 text-primary-800 shrink-0" />}
      <span>{label}</span>
    </Link>
  );
}
