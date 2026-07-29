import React from "react";
import { Image as ImageIcon } from "lucide-react";

/** Loading state shown while the job record is being fetched. */
export default function JobOverviewSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="w-full lg:w-[35%] flex flex-col justify-between bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm p-6 gap-6">
          <div className="flex flex-col gap-5">
            <div>
              <div className="h-5 w-28 bg-secondary-200 rounded-full mb-3" />
              <div className="h-7 w-3/4 bg-secondary-200 rounded-md" />
            </div>
            <div className="flex flex-col gap-4 border-t border-secondary-300 pt-5">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-200 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-3 w-16 bg-secondary-200 rounded" />
                    <div className="h-4 w-1/2 bg-secondary-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4 border-t border-secondary-300">
            <div className="h-11 w-full bg-secondary-200 rounded-xl" />
            <div className="h-11 w-full bg-secondary-200 rounded-xl" />
          </div>
        </div>

        <div className="w-full lg:w-[65%] min-h-[420px] lg:min-h-full bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-secondary-400">
            <ImageIcon size={40} />
            <div className="h-4 w-40 bg-secondary-200 rounded" />
          </div>
        </div>
      </div>

      <div className="bg-secondary-50 rounded-2xl outline outline-1 outline-offset-[-1px] outline-secondary-300 shadow-sm p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="h-4 w-56 bg-secondary-200 rounded" />
          <div className="h-3.5 w-full bg-secondary-200 rounded" />
          <div className="h-3.5 w-full bg-secondary-200 rounded" />
          <div className="h-3.5 w-2/3 bg-secondary-200 rounded" />
        </div>
        <div className="flex flex-col gap-3 border-t border-secondary-300 pt-6">
          <div className="h-4 w-44 bg-secondary-200 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6].map((tag) => (
              <div key={tag} className="h-8 w-24 bg-secondary-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}