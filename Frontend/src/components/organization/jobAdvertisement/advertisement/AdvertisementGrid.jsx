import React from "react";
import AdvertisementCard from "./AdvertisementCard";
import CreateAdvertisementCard from "./CreateAdvertisementCard";

/**
 * Responsive job listing grid.
 * - below 600px: 1 column (stacked)
 * - 600px+: 2 columns
 * - 1200px+: 3 columns
 * The "Create New Advertisement" tile always renders first.
 */
export default function AdvertisementGrid({ jobs = [], createTo }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        
        {jobs.map((job) => (
          <AdvertisementCard key={job.id} {...job} />
        ))}
        <CreateAdvertisementCard to={createTo} />
      </div>

      {jobs.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-4">
          No job postings match your current filters.
        </p>
      )}
    </div>
  );
}