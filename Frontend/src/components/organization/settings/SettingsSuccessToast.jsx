import React, { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { settingsToast } from "./settingdata";

/** Bottom-corner success toast, auto-hides after `autoHideMs`. */
export default function SettingsSuccessToast({
  visible = false,
  title = settingsToast.title,
  message = settingsToast.message,
  autoHideMs = 4000,
  onClose = () => {},
}) {
  useEffect(() => {
    if (!visible) return undefined;
    const timer = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(timer);
  }, [visible, autoHideMs, onClose]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-50 top-24 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6"
    >
      <div className="w-full sm:w-96 px-6 py-4 bg-gray-900 rounded-xl shadow-2xl flex items-center gap-4">
        <span className="w-8 h-8 bg-green-500/20 rounded-full flex justify-center items-center shrink-0">
          <CheckCircle2 className="w-4 h-4 text-green-400" strokeWidth={2.5} />
        </span>

        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-white text-sm font-bold leading-5">{title}</span>
          <span className="text-white/70 text-xs font-normal leading-4">{message}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="pl-2 text-white/50 hover:text-white transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}