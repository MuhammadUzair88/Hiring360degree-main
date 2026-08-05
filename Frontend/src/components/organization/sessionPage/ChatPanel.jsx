import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

/**
 * In-call chat: scrollable message list (auto-scrolls to the newest message)
 * plus a composer. System messages get a distinct, informational style.
 */
export default function ChatPanel({ messages, onSendMessage }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setDraft("");
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg p-3 border ${
              msg.isSystem ? "bg-info-50 border-info-200" : "bg-white border-secondary-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${msg.isSystem ? "text-info-700" : "text-slate-900"}`}>
                {msg.sender}
              </span>
              <span className="text-xs text-neutral-500">{msg.timestamp}</span>
            </div>
            <p className="text-sm text-neutral-600">{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-secondary-300 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white border border-secondary-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-700"
        />
        <button
          type="submit"
          title="Send message"
          className="p-2.5 rounded-lg bg-primary-700 hover:bg-primary-800 text-white transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}