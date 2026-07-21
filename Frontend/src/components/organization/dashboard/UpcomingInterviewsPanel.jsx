import React from "react";
import { Link } from "react-router-dom";
import InterviewScheduleItem from "./InterviewScheduleItem";
import { upcomingInterviews } from "./data";

/** Card listing today/upcoming interviews, with a "View All" link. */
export default function UpcomingInterviewsPanel({
  interviews = upcomingInterviews,
  viewAllTo = "/interviewer",
}) {
  return (
    <div className="self-stretch p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm flex flex-col gap-6">
      <div className="self-stretch flex justify-between items-center">
        <h2 className="text-slate-900 text-xl font-semibold leading-7">Upcoming Interviews</h2>
        <Link
          to={viewAllTo}
          className="text-primary-800 text-xs font-bold leading-4 tracking-tight hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="self-stretch flex flex-col gap-3">
        {interviews.map((interview) => (
          <InterviewScheduleItem key={interview.id} {...interview} />
        ))}
      </div>
    </div>
  );
}
