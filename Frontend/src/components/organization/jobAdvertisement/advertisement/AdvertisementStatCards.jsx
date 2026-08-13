
import React from "react";
import AdvertisementStatMetricCard from "./AdvertisementStatMetricCard";

export default function AdvertisementStatMetricsOverview({ stats = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <AdvertisementStatMetricCard key={stat.id} {...stat} />
      ))}
    </div>
  );
}
