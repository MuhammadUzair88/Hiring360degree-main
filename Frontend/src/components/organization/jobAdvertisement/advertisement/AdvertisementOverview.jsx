import React, { useMemo, useState } from "react";
import { Briefcase, FileText, Radio, XCircle } from "lucide-react";
import AdvertisementPageHeader from "./AdvertisementPageHeader";
import AdvertisementFilterBar from "./AdvertisementFilterBar";
import AdvertisementGrid from "./AdvertisementGrid";
import { StatMetricsOverview } from "../../dashboard";
import { advertisementPageHeader, advertisementFilters } from "./data";
import { useAuth } from "../../../../context/AuthContext";
import { useAsync } from "../../../../hooks/useAsync";
import advertisementService from "../../../../services/advertisementService";
import { mapAdvertisementToCard } from "../../../../utils/adapters";

export default function AdvertisementOverview() {
  const { organization } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState(advertisementFilters.departments[0]);
  const [type, setType] = useState(advertisementFilters.types[0]);

  const { data, isLoading, error } = useAsync(() => advertisementService.getAll(), []);
  const advertisements = data?.advertisements || [];

  const jobs = useMemo(
    () => advertisements.map((ad, index) => mapAdvertisementToCard(ad, index)),
    [advertisements]
  );

  const stats = useMemo(() => {
    const total = advertisements.length;
    const published = advertisements.filter((ad) => ad.status === "published").length;
    const draft = advertisements.filter((ad) => ad.status === "draft").length;
    const closed = advertisements.filter((ad) => ad.status === "closed").length;

    return [
      { id: "total-ads", label: "Total Ads", value: String(total), icon: Briefcase, badgeClass: "bg-primary-50 text-primary-800" },
      { id: "published", label: "Published", value: String(published), icon: Radio, badgeClass: "bg-primary-100 text-primary-600" },
      { id: "draft", label: "Draft", value: String(draft), icon: FileText, badgeClass: "bg-primary-100 text-primary-900" },
      { id: "closed", label: "Closed", value: String(closed), icon: XCircle, badgeClass: "bg-secondary-200 text-primary-700" },
    ];
  }, [advertisements]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch = !query || job.title.toLowerCase().includes(query);
      const matchesDepartment =
        department === advertisementFilters.departments[0] || job.departmentLabel === department;
      const matchesType =
        type === advertisementFilters.types[0] || job.typeLabel === type;

      return matchesSearch && matchesDepartment && matchesType;
    });
  }, [jobs, searchTerm, department, type]);

  return (
    <div className="w-full flex flex-col gap-6">
      <AdvertisementPageHeader organization={{ name: organization?.name || "Your" }} />

      <StatMetricsOverview stats={stats} />

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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-xl bg-secondary-200" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : (
        <AdvertisementGrid jobs={filteredJobs} createTo={advertisementPageHeader.ctaTo} />
      )}
    </div>
  );
}
