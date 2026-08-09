import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";



const COLORS = [
  "#6D28D9",
  "#8B5CF6",
  "#C4B5FD",
];

function WorkloadTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-slate-900">
        {payload[0].name}
      </p>
      <p className="text-xs text-slate-600">
        {payload[0].value} Interviews
      </p>
    </div>
  );
}

export default function PanelistWorkloadCard({ workload = [] }) {
  const workloadData = workload;
  const total = workloadData.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <div className="flex-1 p-6 bg-secondary-50/80 rounded-xl outline outline-1 outline-offset-[-1px] outline-secondary-300 backdrop-blur-sm">

      <h2 className="text-slate-900 text-lg font-semibold mb-5">
        Panelist Workload
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Pie Chart */}
        <div className="relative w-40 h-40">

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Tooltip
                content={<WorkloadTooltip />}
                wrapperStyle={{ zIndex: 100 }}
              />

              <Pie
                data={workloadData}
                dataKey="value"
                innerRadius={42}
                outerRadius={58}
                paddingAngle={3}
                cx="50%"
                cy="50%"
              >
                {workloadData.map((entry, index) => (
                  <Cell
                    key={entry.id || entry.name || index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">
              {total}
            </span>
          </div>

        </div>

        {/* Legend */}
        <div className="flex-1 space-y-4 w-full">

          {workloadData.map((item, index) => (

            <div
              key={item.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index],
                  }}
                />

                <span className="text-sm text-slate-700 font-medium">
                  {item.name}
                </span>

              </div>

              <span className="text-sm font-bold text-slate-900">
                {item.value}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}