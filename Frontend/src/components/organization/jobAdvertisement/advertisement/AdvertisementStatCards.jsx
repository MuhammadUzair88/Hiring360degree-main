import React from "react";
import { advertisementStats } from "./data";
import AdvertisementStatMetricCard from "./AdvertisementStatMetricCard";

/**
 * Responsive grid of top-line KPI cards.
 * - below 600px: 1 column (stacked)
 * - 600px+: 2 columns
 * - 840px+: 3 columns
 * - 1200px+: all 5 in a row
 */
export default function AdvertisementStatMetricsOverview({ stats = advertisementStats }) {
  return (
    <div className="self-stretch grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <AdvertisementStatMetricCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
