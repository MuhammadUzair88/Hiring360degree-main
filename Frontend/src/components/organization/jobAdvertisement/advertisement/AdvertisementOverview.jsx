import React, { useMemo, useState } from "react";
import AdvertisementPageHeader from "./AdvertisementPageHeader";
import AdvertisementFilterBar from "./AdvertisementFilterBar";
import AdvertisementGrid from "./AdvertisementGrid";
// StatMetricsOverview is a fully generic, prop-driven KPI grid — the same
// component the dashboard uses. Reused here rather than duplicated so both
// pages stay visually and structurally consistent.
import { StatMetricsOverview } from "../../dashboard";
import { advertisementPageHeader, advertisementFilters, jobAdvertisements } from "./data";
import AdvertisementStatMetricsOverview from "./AdvertisementStatCards";

export default function AdvertisementOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState(advertisementFilters.departments[0]);
  const [type, setType] = useState(advertisementFilters.types[0]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return jobAdvertisements.filter((job) => {
      const matchesSearch = !query || job.title.toLowerCase().includes(query);
      const matchesDepartment =
        department === advertisementFilters.departments[0] || job.departmentLabel === department;
      const matchesType = type === advertisementFilters.types[0] || job.typeLabel === type;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [searchTerm, department, type]);

  return (
    <div className="w-full flex flex-col gap-6">
      <AdvertisementPageHeader />

      <AdvertisementStatMetricsOverview />
      

      <AdvertisementFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        departmentValue={department}
        onDepartmentChange={setDepartment}
        departments={advertisementFilters.departments}
        typeValue={type}
        onTypeChange={setType}
        types={advertisementFilters.types}
      />

      <AdvertisementGrid jobs={filteredJobs} createTo={advertisementPageHeader.ctaTo} />
    </div>
  );
}