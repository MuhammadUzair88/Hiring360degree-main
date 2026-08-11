import React from "react";
import AdvertisementCard from "./AdvertisementCard";
import CreateAdvertisementCard from "./CreateAdvertisementCard";

export default function AdvertisementGrid({
  jobs = [],
  createTo,
  onRequestDelete = () => {},
  onStatusChange = () => {},
  mutatingId = null,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <AdvertisementCard
            key={job.id}
            {...job}
            isMutating={mutatingId === job.id}
            onRequestDelete={() => onRequestDelete(job)}
            onStatusChange={onStatusChange}
          />
        ))}

        <CreateAdvertisementCard to={createTo} />
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-secondary-300 bg-secondary-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No advertisements match your filters.</p>
          <p className="mt-1 text-xs text-gray-400">Clear the filters or create a new job posting.</p>
        </div>
      ) : null}
    </div>
  );
}
