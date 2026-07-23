import React from "react";
import DashboardGreetingBanner from "./DashboardGreetingBanner";
import StatMetricsOverview from "./StatMetricsOverview";
import HiringFunnelChart from "./HiringFunnelChart";
import UpcomingInterviewsPanel from "./UpcomingInterviewsPanel";
import PanelistWorkloadCard from "./PanelistWorkloadCard";
import QuickActionsPanel from "./QuickActionsPanel";
import RecentActivityTimeline from "./RecentActivityTimeline";


export default function DashboardOverview() {
  return (
    <div className="w-full flex flex-col gap-6">

      <DashboardGreetingBanner />

      <StatMetricsOverview />

      <HiringFunnelChart />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        
        <div className="xl:col-span-2 flex flex-col gap-6">

          
          <UpcomingInterviewsPanel />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <PanelistWorkloadCard />

            <QuickActionsPanel />

          </div>

        </div>

        <div className="xl:col-span-1">

          <RecentActivityTimeline />

        </div>

      </div>

    </div>
  );
}