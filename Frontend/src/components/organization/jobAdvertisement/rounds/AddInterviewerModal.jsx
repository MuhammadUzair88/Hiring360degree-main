import React, { useState } from "react";
import { UserPlus, X } from "lucide-react";

export default function AddInterviewerModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName("");
    setEmail("");
    setType("");
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !type.trim()) return;
    onSubmit({ name: name.trim(), email: email.trim(), type: type.trim() });
    setName("");
    setEmail("");
    setType("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-secondary-50 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-secondary-300 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-800">
            <UserPlus className="w-4 h-4" />
            <h4 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Register Interviewer</h4>
          </div>
          <button type="button" onClick={resetAndClose} className="p-1.5 rounded-lg text-gray-500 hover:bg-secondary-200 hover:text-slate-900 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Full Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Sumit Sharma"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="px-4 py-3 bg-secondary-100 rounded-xl text-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 focus:outline-primary-800 text-slate-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Work Email</label>
            <input
              required
              type="email"
              placeholder="sumit@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="px-4 py-3 bg-secondary-100 rounded-xl text-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 focus:outline-primary-800 text-slate-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Department</label>
            <input
              required
              type="text"
              placeholder="e.g. Core Engineering"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="px-4 py-3 bg-secondary-100 rounded-xl text-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 focus:outline-primary-800 text-slate-900 placeholder:text-gray-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 text-sm font-semibold">
            <button type="button" onClick={resetAndClose} className="px-5 py-2.5 rounded-xl text-gray-700 hover:bg-secondary-200 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-800 text-white hover:bg-primary-700 shadow-md transition-colors">
              Add Interviewer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}