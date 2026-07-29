import React from "react";
import { Image as ImageIcon } from "lucide-react";

/** Right "Campaign Asset" panel — shows the generated pamphlet image, or an empty state when none exists yet. */
export default function JobOverviewAssetPanel({ job }) {
  return (
    <div className="w-full lg:w-[65%] min-h-[420px] lg:min-h-full relative bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm flex items-center justify-center p-4">
      <span className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-[11px] font-bold tracking-widest uppercase">
        Campaign Asset
      </span>

      {job.generatedImageUrl ? (
        <img
          src={job.generatedImageUrl}
          alt={`${job.jobTitle} advertisement pamphlet`}
          className="max-w-full max-h-full object-contain rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-3 text-black/50 max-w-xs">
          <ImageIcon className="w-10 h-10" />
          <div className="flex flex-col gap-1">
            <p className="text-black/70 text-sm font-medium">No campaign asset generated.</p>
            <p className="text-xs leading-5">
              You skipped generating a visual pamphlet for this job. Edit the job to create one.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}