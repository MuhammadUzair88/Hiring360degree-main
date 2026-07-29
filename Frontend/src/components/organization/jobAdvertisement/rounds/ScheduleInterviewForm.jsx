import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, AlertCircle, CheckCircle2, Loader2, User, UserPlus, X } from "lucide-react";
import { QUICK_TIMES, formatTimeDisplay, isDateTimeInFuture, isValidTimeFormat } from "./utils";

export default function ScheduleInterviewForm({
  roundName,
  selectedCandidate,
  onClearSelectedCandidate,
  editingSchedule,
  onCancelEdit,
  interviewers,
  onOpenAddInterviewer,
  interviewerId,
  onInterviewerChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  onTimeBlur,
  availabilityConflict,
  formError,
  isSubmitting,
  onSubmit,
  
}) {
  const candidateName = editingSchedule ? editingSchedule.candidateName : selectedCandidate?.name;
  const isTimeValid = isValidTimeFormat(time);
  const isFutureValid = editingSchedule || isDateTimeInFuture(date, time);
  const canSubmit = Boolean((editingSchedule || selectedCandidate) && interviewerId && date && isTimeValid && isFutureValid && !availabilityConflict);
    const navigate = useNavigate();

  let submitLabel = editingSchedule ? "Update Schedule" : "Confirm & Lock Slot";
  if (!time) submitLabel = "Enter Interview Time";
  else if (!isTimeValid) submitLabel = "Enter A Valid Time";
  else if (!isFutureValid) submitLabel = "Pick A Future Date & Time";
  else if (availabilityConflict) submitLabel = "Interviewer Unavailable";
  if (isSubmitting) submitLabel = editingSchedule ? "Updating…" : "Scheduling…";

  return (
    <div className="w-full lg:w-[40%] bg-secondary-50 rounded-2xl p-6 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col">
      <form onSubmit={onSubmit} className="flex flex-col gap-5 flex-1 justify-between">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-secondary-300 pb-4">
            <div>
              <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Schedule Interview</h3>
              <p className="text-gray-500 text-xs mt-1">
                {editingSchedule ? `Update this ${roundName || "round"} slot` : `Lock a slot for ${roundName || "this round"}`}
              </p>
            </div>
            {editingSchedule && (
              <button type="button" onClick={onCancelEdit} className="text-xs font-semibold text-warning-600 hover:text-warning-700 flex items-center gap-1 bg-warning-50 px-3 py-1.5 rounded-lg">
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          {!formError && availabilityConflict && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {availabilityConflict.interviewerName} is already booked with {availabilityConflict.candidateName} at that time.
            </div>
          )}

          {!formError && !availabilityConflict && interviewerId && date && isTimeValid && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 outline outline-1 outline-offset-[-1px] outline-success-200 text-success-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Interviewer is available at this time
            </div>
          )}

          {/* Candidate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Candidate Selection</label>
            {candidateName ? (
              <div className="h-12 px-4 bg-primary-800/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800/20 flex items-center justify-between">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary-800/10 text-primary-800 text-xs font-semibold flex items-center justify-center shrink-0">
                    {candidateName.charAt(0)}
                  </span>
                  <span className="text-slate-900 text-sm font-medium truncate">{candidateName}</span>
                </span>
                {!editingSchedule && (
                  <button type="button" onClick={onClearSelectedCandidate} className="text-gray-500 hover:text-danger-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-2 text-gray-400 text-sm">
                <User className="w-4 h-4" /> Pick a candidate from the list on the left
              </div>
            )}
          </div>

          {/* Interviewer */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
  <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
    Assigned Interviewer
  </label>

  <button
    type="button"
    onClick={() => navigate("/interviewer")}
    className="text-xs font-semibold text-primary-800 hover:text-primary-700 flex items-center gap-1 transition-colors"
  >
    <UserPlus className="w-3.5 h-3.5" />
    Add Interviewer
  </button>
</div>
            <select
              required
              value={interviewerId}
              onChange={(event) => onInterviewerChange(event.target.value)}
              className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none appearance-none"
            >
              <option value="">-- Choose Interviewer --</option>
              {interviewers.map((interviewer) => (
                <option key={interviewer.id} value={interviewer.id}>
                  {interviewer.name} ({interviewer.type})
                </option>
              ))}
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Date</label>
              <input
                required
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(event) => onDateChange(event.target.value)}
                className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Time (24h)</label>
              <input
                required
                type="text"
                placeholder="14:30"
                value={time}
                onChange={(event) => onTimeChange(event.target.value)}
                onBlur={onTimeBlur}
                className={`h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] text-sm font-medium text-slate-900 outline-none ${
                  time && !isTimeValid ? "outline-danger-300" : "outline-secondary-300"
                }`}
              />
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Quick Picks</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TIMES.map((quickTime) => (
                <button
                  key={quickTime}
                  type="button"
                  onClick={() => onTimeChange(quickTime)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold outline outline-1 outline-offset-[-1px] transition-colors ${
                    time === quickTime ? "bg-primary-800 text-white outline-primary-800" : "bg-secondary-100 text-gray-700 outline-secondary-300 hover:outline-primary-800/40 hover:text-primary-800"
                  }`}
                >
                  {formatTimeDisplay(quickTime)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors ${
            !canSubmit || isSubmitting ? "bg-secondary-400 cursor-not-allowed" : editingSchedule ? "bg-warning-600 hover:bg-warning-700" : "bg-primary-800 hover:bg-primary-700"
          }`}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
          {submitLabel}
        </button>
      </form>
    </div>
  );
}