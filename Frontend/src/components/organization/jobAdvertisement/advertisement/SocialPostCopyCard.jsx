import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyTextToClipboard } from "./publishUtils";

/** Generated caption + a Copy Text button that actually copies it (navigator.clipboard), with a 2s "Copied!" confirmation. */
export default function SocialPostCopyCard({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const didCopy = await copyTextToClipboard(text);
    if (didCopy) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-slate-900 text-sm font-bold uppercase tracking-tight">Social Media Copy</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-primary-800 text-sm font-medium hover:bg-primary-50 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy Text"}
        </button>
      </div>
      <div className="p-5 bg-primary-50 rounded-xl outline outline-2 outline-offset-[-2px] outline-secondary-300">
        <p className="text-slate-900 text-base whitespace-pre-line leading-6">{text}</p>
      </div>
    </div>
  );
}