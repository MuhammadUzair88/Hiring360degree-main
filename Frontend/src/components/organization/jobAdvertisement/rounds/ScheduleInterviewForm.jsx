// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, AlertCircle, CheckCircle2, Loader2, User, UserPlus, X } from "lucide-react";
// import { QUICK_TIMES, formatTimeDisplay, isDateTimeInFuture, isValidTimeFormat } from "./utils";

// export default function ScheduleInterviewForm({
//   roundName,
//   selectedCandidate,
//   onClearSelectedCandidate,
//   editingSchedule,
//   onCancelEdit,
//   interviewers,
//   onOpenAddInterviewer,
//   interviewerId,
//   onInterviewerChange,
//   date,
//   onDateChange,
//   time,
//   onTimeChange,
//   onTimeBlur,
//   availabilityConflict,
//   formError,
//   isSubmitting,
//   onSubmit,
  
// }) {
//   const candidateName = editingSchedule ? editingSchedule.candidateName : selectedCandidate?.name;
//   const isTimeValid = isValidTimeFormat(time);
//   const isFutureValid = editingSchedule || isDateTimeInFuture(date, time);
//   const canSubmit = Boolean((editingSchedule || selectedCandidate) && interviewerId && date && isTimeValid && isFutureValid && !availabilityConflict);
//     const navigate = useNavigate();

//   let submitLabel = editingSchedule ? "Update Schedule" : "Confirm & Lock Slot";
//   if (!time) submitLabel = "Enter Interview Time";
//   else if (!isTimeValid) submitLabel = "Enter A Valid Time";
//   else if (!isFutureValid) submitLabel = "Pick A Future Date & Time";
//   else if (availabilityConflict) submitLabel = "Interviewer Unavailable";
//   if (isSubmitting) submitLabel = editingSchedule ? "Updating…" : "Scheduling…";

//   return (
//     <div className="w-full lg:w-[40%] bg-secondary-50 rounded-2xl p-6 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col">
//       <form onSubmit={onSubmit} className="flex flex-col gap-5 flex-1 justify-between">
//         <div className="flex flex-col gap-5">
//           <div className="flex items-center justify-between border-b border-secondary-300 pb-4">
//             <div>
//               <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Schedule Interview</h3>
//               <p className="text-gray-500 text-xs mt-1">
//                 {editingSchedule ? `Update this ${roundName || "round"} slot` : `Lock a slot for ${roundName || "this round"}`}
//               </p>
//             </div>
//             {editingSchedule && (
//               <button type="button" onClick={onCancelEdit} className="text-xs font-semibold text-warning-600 hover:text-warning-700 flex items-center gap-1 bg-warning-50 px-3 py-1.5 rounded-lg">
//                 <X className="w-3.5 h-3.5" /> Cancel Edit
//               </button>
//             )}
//           </div>

//           {formError && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
//               <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
//             </div>
//           )}

//           {!formError && availabilityConflict && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
//               <AlertCircle className="w-4 h-4 shrink-0" />
//               {availabilityConflict.interviewerName} is already booked with {availabilityConflict.candidateName} at that time.
//             </div>
//           )}

//           {!formError && !availabilityConflict && interviewerId && date && isTimeValid && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 outline outline-1 outline-offset-[-1px] outline-success-200 text-success-700 text-sm font-medium">
//               <CheckCircle2 className="w-4 h-4 shrink-0" /> Interviewer is available at this time
//             </div>
//           )}

//           {/* Candidate */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Candidate Selection</label>
//             {candidateName ? (
//               <div className="h-12 px-4 bg-primary-800/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800/20 flex items-center justify-between">
//                 <span className="flex items-center gap-2 min-w-0">
//                   <span className="w-6 h-6 rounded-full bg-primary-800/10 text-primary-800 text-xs font-semibold flex items-center justify-center shrink-0">
//                     {candidateName.charAt(0)}
//                   </span>
//                   <span className="text-slate-900 text-sm font-medium truncate">{candidateName}</span>
//                 </span>
//                 {!editingSchedule && (
//                   <button type="button" onClick={onClearSelectedCandidate} className="text-gray-500 hover:text-danger-600 transition-colors">
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-2 text-gray-400 text-sm">
//                 <User className="w-4 h-4" /> Pick a candidate from the list on the left
//               </div>
//             )}
//           </div>

//           {/* Interviewer */}
//           <div className="flex flex-col gap-1.5">
//             <div className="flex items-center justify-between">
//   <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
//     Assigned Interviewer
//   </label>

//   <button
//     type="button"
//     onClick={() => navigate("/interviewer")}
//     className="text-xs font-semibold text-primary-800 hover:text-primary-700 flex items-center gap-1 transition-colors"
//   >
//     <UserPlus className="w-3.5 h-3.5" />
//     Add Interviewer
//   </button>
// </div>
//             <select
//               required
//               value={interviewerId}
//               onChange={(event) => onInterviewerChange(event.target.value)}
//               className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none appearance-none"
//             >
//               <option value="">-- Choose Interviewer --</option>
//               {interviewers.map((interviewer) => (
//                 <option key={interviewer.id} value={interviewer.id}>
//                   {interviewer.name} ({interviewer.type})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date + Time */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Date</label>
//               <input
//                 required
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 value={date}
//                 onChange={(event) => onDateChange(event.target.value)}
//                 className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none"
//               />
//             </div>
//             <div className="flex flex-col gap-1.5">
//               <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Time (24h)</label>
//               <input
//                 required
//                 type="text"
//                 placeholder="14:30"
//                 value={time}
//                 onChange={(event) => onTimeChange(event.target.value)}
//                 onBlur={onTimeBlur}
//                 className={`h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] text-sm font-medium text-slate-900 outline-none ${
//                   time && !isTimeValid ? "outline-danger-300" : "outline-secondary-300"
//                 }`}
//               />
//             </div>
//           </div>

//           <div>
//             <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Quick Picks</p>
//             <div className="flex flex-wrap gap-2">
//               {QUICK_TIMES.map((quickTime) => (
//                 <button
//                   key={quickTime}
//                   type="button"
//                   onClick={() => onTimeChange(quickTime)}
//                   className={`px-3 py-1.5 rounded-lg text-xs font-semibold outline outline-1 outline-offset-[-1px] transition-colors ${
//                     time === quickTime ? "bg-primary-800 text-white outline-primary-800" : "bg-secondary-100 text-gray-700 outline-secondary-300 hover:outline-primary-800/40 hover:text-primary-800"
//                   }`}
//                 >
//                   {formatTimeDisplay(quickTime)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={!canSubmit || isSubmitting}
//           className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors ${
//             !canSubmit || isSubmitting ? "bg-secondary-400 cursor-not-allowed" : editingSchedule ? "bg-warning-600 hover:bg-warning-700" : "bg-primary-800 hover:bg-primary-700"
//           }`}
//         >
//           {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
//           {submitLabel}
//         </button>
//       </form>
//     </div>
//   );
// }

   import React, { useEffect, useMemo, useState } from "react";
   import { useNavigate } from "react-router-dom";
   import { Calendar, AlertCircle, CheckCircle2, Loader2, User, UserPlus, X } from "lucide-react";
   import { QUICK_TIMES, formatTimeDisplay, isDateTimeInFuture, isValidTimeFormat } from "./utils";
/* ---------- Date / time helpers ---------- */

/** Today's date as YYYY-MM-DD in the user's LOCAL timezone (toISOString() uses UTC and lets yesterday slip through). */
function getTodayLocal() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 12-hour pieces -> "HH:mm" (24h). The rest of the app keeps receiving the same format as before. */
function to24Hour(hour12, minute, period) {
  const base = Number(hour12) % 12;
  const hours = period === "PM" ? base + 12 : base;
  return `${String(hours).padStart(2, "0")}:${minute}`;
}

/** "HH:mm" (24h) -> 12-hour pieces, or null if the value is not a valid time. */
function from24Hour(value) {
  if (!isValidTimeFormat(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return {
    hour12: String(hours % 12 || 12),
    minute: String(minutes).padStart(2, "0"),
    period: hours >= 12 ? "PM" : "AM",
  };
}

const HOURS = Array.from({ length: 12 }, (_, index) => String(index + 1));
const MINUTES = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));

const FIELD_CLASS =
  "h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 w-full";
const LABEL_CLASS = "text-gray-500 text-xs font-semibold uppercase tracking-wide";

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
  const navigate = useNavigate();

  const candidateName = editingSchedule ? editingSchedule.candidateName : selectedCandidate?.name;
  const isTimeValid = isValidTimeFormat(time);
  const isFutureValid = editingSchedule || isDateTimeInFuture(date, time);
  const canSubmit = Boolean(
    (editingSchedule || selectedCandidate) &&
      interviewerId &&
      date &&
      isTimeValid &&
      isFutureValid &&
      !availabilityConflict
  );

  const todayLocal = getTodayLocal();

  /* ---------- 12-hour time picker state ---------- */
  const [hour12, setHour12] = useState("");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  // Keep the picker in sync when `time` changes from outside (Quick Picks, edit mode, form reset).
  useEffect(() => {
    if (!time) {
      setHour12("");
      return;
    }
    const parsed = from24Hour(time);
    if (parsed) {
      setHour12(parsed.hour12);
      setMinute(parsed.minute);
      setPeriod(parsed.period);
    }
  }, [time]);

  // If an existing schedule has a minute that isn't a 5-minute step (e.g. 14:07), still show it.
  const minuteOptions = useMemo(
    () => (MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort()),
    [minute]
  );

  const updateTime = (nextHour, nextMinute, nextPeriod) => {
    setHour12(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);
    onTimeChange(nextHour ? to24Hour(nextHour, nextMinute, nextPeriod) : "");
  };

  const handleDateChange = (value) => {
    // Ignore past dates even if typed by hand.
    if (value && value < todayLocal) return;
    onDateChange(value);
  };

  /* ---------- Submit button label ---------- */
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
          {/* Header */}
          <div className="flex items-center justify-between border-b border-secondary-300 pb-4">
            <div>
              <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Schedule Interview</h3>
              <p className="text-gray-500 text-xs mt-1">
                {editingSchedule ? `Update this ${roundName || "round"} slot` : `Lock a slot for ${roundName || "this round"}`}
              </p>
            </div>
            {editingSchedule && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="text-xs font-semibold text-warning-600 hover:text-warning-700 flex items-center gap-1 bg-warning-50 px-3 py-1.5 rounded-lg"
              >
                <X className="w-3.5 h-3.5" /> Cancel Edit
              </button>
            )}
          </div>

          {/* Banners */}
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
            <label className={LABEL_CLASS}>Candidate Selection</label>
            {candidateName ? (
              <div className="h-12 px-4 bg-primary-800/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800/20 flex items-center justify-between">
                <span className="flex items-center gap-2 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-primary-800/10 text-primary-800 text-xs font-semibold flex items-center justify-center shrink-0">
                    {candidateName.charAt(0)}
                  </span>
                  <span className="text-slate-900 text-sm font-medium truncate">{candidateName}</span>
                </span>
                {!editingSchedule && (
                  <button
                    type="button"
                    onClick={onClearSelectedCandidate}
                    className="text-gray-500 hover:text-danger-600 transition-colors"
                  >
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
              <label className={LABEL_CLASS}>Assigned Interviewer</label>
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

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Date</label>
            <input
              required
              type="date"
              min={todayLocal}
              value={date}
              onChange={(event) => handleDateChange(event.target.value)}
              className={`${FIELD_CLASS} outline-none`}
            />
          </div>

          {/* Time (12-hour) */}
          <div className="flex flex-col gap-1.5">
            <label className={LABEL_CLASS}>Time</label>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <select
                required
                aria-label="Hour"
                value={hour12}
                onChange={(event) => updateTime(event.target.value, minute, period)}
                onBlur={onTimeBlur}
                className={FIELD_CLASS}
              >
                <option value="">Hour</option>
                {HOURS.map((hour) => (
                  <option key={hour} value={hour}>{hour}</option>
                ))}
              </select>

              <select
                aria-label="Minute"
                value={minute}
                onChange={(event) => updateTime(hour12, event.target.value, period)}
                onBlur={onTimeBlur}
                className={FIELD_CLASS}
              >
                {minuteOptions.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>

              <div
                role="group"
                aria-label="AM or PM"
                className="flex h-12 rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] outline-secondary-300"
              >
                {["AM", "PM"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={period === value}
                    onClick={() => updateTime(hour12, minute, value)}
                    className={`px-4 text-sm font-semibold transition-colors ${
                      period === value
                        ? "bg-primary-800 text-white"
                        : "bg-secondary-100 text-gray-700 hover:text-primary-800"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick picks */}
          <div>
            <p className={`${LABEL_CLASS} mb-2`}>Quick Picks</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_TIMES.map((quickTime) => (
                <button
                  key={quickTime}
                  type="button"
                  onClick={() => onTimeChange(quickTime)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold outline outline-1 outline-offset-[-1px] transition-colors ${
                    time === quickTime
                      ? "bg-primary-800 text-white outline-primary-800"
                      : "bg-secondary-100 text-gray-700 outline-secondary-300 hover:outline-primary-800/40 hover:text-primary-800"
                  }`}
                >
                  {formatTimeDisplay(quickTime)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors ${
            !canSubmit || isSubmitting
              ? "bg-secondary-400 cursor-not-allowed"
              : editingSchedule
              ? "bg-warning-600 hover:bg-warning-700"
              : "bg-primary-800 hover:bg-primary-700"
          }`}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
          {submitLabel}
        </button>
      </form>
    </div>
  );
}








// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, AlertCircle, CheckCircle2, Loader2, User, UserPlus, X } from "lucide-react";
// import { QUICK_TIMES, formatTimeDisplay, isDateTimeInFuture, isValidTimeFormat } from "./utils";

// /* Today's date in the user's LOCAL timezone (YYYY-MM-DD).
//    The old toISOString() used UTC, so early in the day the previous date was still selectable. */
// function getTodayLocal() {
//   const now = new Date();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");
//   return `${now.getFullYear()}-${month}-${day}`;
// }

// /* 12-hour pieces -> "HH:mm" (24h), which is what the rest of the app expects */
// function to24Hour(hour12, minute, period) {
//   const base = Number(hour12) % 12;
//   const hours = period === "PM" ? base + 12 : base;
//   return `${String(hours).padStart(2, "0")}:${minute}`;
// }

// const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
// const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

// const selectClass =
//   "h-12 px-3 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 w-full";

// export default function ScheduleInterviewForm({
//   roundName,
//   selectedCandidate,
//   onClearSelectedCandidate,
//   editingSchedule,
//   onCancelEdit,
//   interviewers,
//   onOpenAddInterviewer,
//   interviewerId,
//   onInterviewerChange,
//   date,
//   onDateChange,
//   time,
//   onTimeChange,
//   onTimeBlur,
//   availabilityConflict,
//   formError,
//   isSubmitting,
//   onSubmit,
// }) {
//   const candidateName = editingSchedule ? editingSchedule.candidateName : selectedCandidate?.name;
//   const isTimeValid = isValidTimeFormat(time);
//   const isFutureValid = editingSchedule || isDateTimeInFuture(date, time);
//   const canSubmit = Boolean((editingSchedule || selectedCandidate) && interviewerId && date && isTimeValid && isFutureValid && !availabilityConflict);
//   const navigate = useNavigate();

//   const todayLocal = getTodayLocal();

//   // 12-hour time picker state (hour 1-12, minute, AM/PM)
//   const [hour12, setHour12] = useState("");
//   const [minute, setMinute] = useState("00");
//   const [period, setPeriod] = useState("AM");

//   // Keep the picker in sync when time changes from outside (quick picks, edit mode, reset)
//   useEffect(() => {
//     if (!time) {
//       setHour12("");
//       return;
//     }
//     if (isValidTimeFormat(time)) {
//       const [hh, mm] = time.split(":").map(Number);
//       setPeriod(hh >= 12 ? "PM" : "AM");
//       setHour12(String(hh % 12 || 12));
//       setMinute(String(mm).padStart(2, "0"));
//     }
//   }, [time]);

//   const updateTime = (nextHour, nextMinute, nextPeriod) => {
//     setHour12(nextHour);
//     setMinute(nextMinute);
//     setPeriod(nextPeriod);
//     onTimeChange(nextHour ? to24Hour(nextHour, nextMinute, nextPeriod) : "");
//   };

//   const handleDateChange = (value) => {
//     // Block past dates even if typed manually
//     if (value && value < todayLocal) return;
//     onDateChange(value);
//   };

//   const minuteOptions = MINUTES.includes(minute) ? MINUTES : [...MINUTES, minute].sort();

//   let submitLabel = editingSchedule ? "Update Schedule" : "Confirm & Lock Slot";
//   if (!time) submitLabel = "Select Interview Time";
//   else if (!isTimeValid) submitLabel = "Enter A Valid Time";
//   else if (!isFutureValid) submitLabel = "Pick A Future Date & Time";
//   else if (availabilityConflict) submitLabel = "Interviewer Unavailable";
//   if (isSubmitting) submitLabel = editingSchedule ? "Updating…" : "Scheduling…";

//   return (
//     <div className="w-full lg:w-[40%] bg-secondary-50 rounded-2xl p-6 shadow-sm outline outline-1 outline-offset-[-1px] outline-secondary-300 flex flex-col">
//       <form onSubmit={onSubmit} className="flex flex-col gap-5 flex-1 justify-between">
//         <div className="flex flex-col gap-5">
//           <div className="flex items-center justify-between border-b border-secondary-300 pb-4">
//             <div>
//               <h3 className="text-slate-900 text-sm font-semibold uppercase tracking-wide">Schedule Interview</h3>
//               <p className="text-gray-500 text-xs mt-1">
//                 {editingSchedule ? `Update this ${roundName || "round"} slot` : `Lock a slot for ${roundName || "this round"}`}
//               </p>
//             </div>
//             {editingSchedule && (
//               <button type="button" onClick={onCancelEdit} className="text-xs font-semibold text-warning-600 hover:text-warning-700 flex items-center gap-1 bg-warning-50 px-3 py-1.5 rounded-lg">
//                 <X className="w-3.5 h-3.5" /> Cancel Edit
//               </button>
//             )}
//           </div>

//           {formError && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
//               <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
//             </div>
//           )}

//           {!formError && availabilityConflict && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-50 outline outline-1 outline-offset-[-1px] outline-danger-200 text-danger-600 text-sm font-medium">
//               <AlertCircle className="w-4 h-4 shrink-0" />
//               {availabilityConflict.interviewerName} is already booked with {availabilityConflict.candidateName} at that time.
//             </div>
//           )}

//           {!formError && !availabilityConflict && interviewerId && date && isTimeValid && (
//             <div className="flex items-center gap-2 p-3 rounded-xl bg-success-50 outline outline-1 outline-offset-[-1px] outline-success-200 text-success-700 text-sm font-medium">
//               <CheckCircle2 className="w-4 h-4 shrink-0" /> Interviewer is available at this time
//             </div>
//           )}

//           {/* Candidate */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Candidate Selection</label>
//             {candidateName ? (
//               <div className="h-12 px-4 bg-primary-800/5 rounded-lg outline outline-1 outline-offset-[-1px] outline-primary-800/20 flex items-center justify-between">
//                 <span className="flex items-center gap-2 min-w-0">
//                   <span className="w-6 h-6 rounded-full bg-primary-800/10 text-primary-800 text-xs font-semibold flex items-center justify-center shrink-0">
//                     {candidateName.charAt(0)}
//                   </span>
//                   <span className="text-slate-900 text-sm font-medium truncate">{candidateName}</span>
//                 </span>
//                 {!editingSchedule && (
//                   <button type="button" onClick={onClearSelectedCandidate} className="text-gray-500 hover:text-danger-600 transition-colors">
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <div className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 flex items-center gap-2 text-gray-400 text-sm">
//                 <User className="w-4 h-4" /> Pick a candidate from the list on the left
//               </div>
//             )}
//           </div>

//           {/* Interviewer */}
//           <div className="flex flex-col gap-1.5">
//             <div className="flex items-center justify-between">
//               <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
//                 Assigned Interviewer
//               </label>

//               <button
//                 type="button"
//                 onClick={() => navigate("/interviewer")}
//                 className="text-xs font-semibold text-primary-800 hover:text-primary-700 flex items-center gap-1 transition-colors"
//               >
//                 <UserPlus className="w-3.5 h-3.5" />
//                 Add Interviewer
//               </button>
//             </div>
//             <select
//               required
//               value={interviewerId}
//               onChange={(event) => onInterviewerChange(event.target.value)}
//               className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none appearance-none"
//             >
//               <option value="">-- Choose Interviewer --</option>
//               {interviewers.map((interviewer) => (
//                 <option key={interviewer.id} value={interviewer.id}>
//                   {interviewer.name} ({interviewer.type})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Date</label>
//             <input
//               required
//               type="date"
//               min={todayLocal}
//               value={date}
//               onChange={(event) => handleDateChange(event.target.value)}
//               className="h-12 px-4 bg-secondary-100 rounded-lg outline outline-1 outline-offset-[-1px] outline-secondary-300 text-sm font-medium text-slate-900 outline-none"
//             />
//           </div>

//           {/* Time (12-hour) */}
//           <div className="flex flex-col gap-1.5">
//             <label className="text-gray-500 text-xs font-semibold uppercase tracking-wide">Time</label>
//             <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
//               <select
//                 required
//                 aria-label="Hour"
//                 value={hour12}
//                 onChange={(event) => updateTime(event.target.value, minute, period)}
//                 className={selectClass}
//               >
//                 <option value="">Hour</option>
//                 {HOURS.map((h) => (
//                   <option key={h} value={h}>{h}</option>
//                 ))}
//               </select>

//               <select
//                 aria-label="Minute"
//                 value={minute}
//                 onChange={(event) => updateTime(hour12, event.target.value, period)}
//                 className={selectClass}
//               >
//                 {minuteOptions.map((m) => (
//                   <option key={m} value={m}>{m}</option>
//                 ))}
//               </select>

//               <div className="flex h-12 rounded-lg overflow-hidden outline outline-1 outline-offset-[-1px] outline-secondary-300">
//                 {["AM", "PM"].map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     onClick={() => updateTime(hour12, minute, p)}
//                     className={`px-4 text-sm font-semibold transition-colors ${
//                       period === p ? "bg-primary-800 text-white" : "bg-secondary-100 text-gray-700 hover:text-primary-800"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div>
//             <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Quick Picks</p>
//             <div className="flex flex-wrap gap-2">
//               {QUICK_TIMES.map((quickTime) => (
//                 <button
//                   key={quickTime}
//                   type="button"
//                   onClick={() => onTimeChange(quickTime)}
//                   className={`px-3 py-1.5 rounded-lg text-xs font-semibold outline outline-1 outline-offset-[-1px] transition-colors ${
//                     time === quickTime ? "bg-primary-800 text-white outline-primary-800" : "bg-secondary-100 text-gray-700 outline-secondary-300 hover:outline-primary-800/40 hover:text-primary-800"
//                   }`}
//                 >
//                   {formatTimeDisplay(quickTime)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={!canSubmit || isSubmitting}
//           className={`w-full py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors ${
//             !canSubmit || isSubmitting ? "bg-secondary-400 cursor-not-allowed" : editingSchedule ? "bg-warning-600 hover:bg-warning-700" : "bg-primary-800 hover:bg-primary-700"
//           }`}
//         >
//           {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
//           {submitLabel}
//         </button>
//       </form>
//     </div>
//   );
// }