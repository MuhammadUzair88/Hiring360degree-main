import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Archive, BriefcaseBusiness, Radio, Users } from "lucide-react";

import AdvertisementPageHeader from "./AdvertisementPageHeader";
import AdvertisementFilterBar from "./AdvertisementFilterBar";
import AdvertisementGrid from "./AdvertisementGrid";
import AdvertisementStatMetricsOverview from "./AdvertisementStatCards";
import DeleteAdvertisementModal from "./DeleteAdvertisementModal";

import { useAuth } from "../../../../context/AuthContext";
import { useToast } from "../../../../context/ToastContext";
import advertisementService from "../../../../services/advertisementService";
import { advertisementPageHeader } from "./data";

const REFRESH_INTERVAL_MS = 15_000;

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  if (value === "close" || value === "closed") return "closed";
  return value === "live" ? "live" : value;
}

function mapAdvertisementToCard(advertisement) {
  return {
    id: String(advertisement._id),
    title: advertisement.jobTitle || "Untitled Job",
    departmentLabel: advertisement.department || "General",
    typeLabel: advertisement.employmentType || "Not specified",
    location:
      advertisement.location || advertisement.workMode || "Location not specified",
    salary: advertisement.salary ?? null,
    postedDate: formatDate(advertisement.createdAt),
    endDate: formatDate(advertisement.deadline),
    createdAt: advertisement.createdAt || null,
    tags: Array.isArray(advertisement.skills) ? advertisement.skills : [],
    applicantsCount: Number(advertisement.applicantsCount || 0),
    status: advertisement.status,
    workMode: advertisement.workMode,
    experience: advertisement.experience,
    description: advertisement.description,
  };
}

export default function AdvertisementOverview() {
  const { organization } = useAuth();
  const toast = useToast();

  const [advertisements, setAdvertisements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [type, setType] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("newest");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState(null);

  const loadAdvertisements = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setIsLoading(true);

      const response = await advertisementService.getAll();
      const nextAdvertisements = Array.isArray(response?.advertisements)
        ? response.advertisements
        : [];

      setAdvertisements(nextAdvertisements);
      setError("");
    } catch (requestError) {
      console.error("Advertisement loading error:", requestError);

      if (!silent) setAdvertisements([]);

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to load advertisements."
      );
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdvertisements();
  }, [loadAdvertisements]);

  useEffect(() => {
    const refresh = () => loadAdvertisements({ silent: true });
    const intervalId = window.setInterval(refresh, REFRESH_INTERVAL_MS);

    const handleFocus = () => refresh();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadAdvertisements]);

  const jobs = useMemo(
    () => advertisements.map(mapAdvertisementToCard),
    [advertisements]
  );

  const stats = useMemo(() => {
    const total = advertisements.length;
    const live = advertisements.filter(
      (advertisement) => normalizeStatus(advertisement.status) === "live"
    ).length;
    const closed = advertisements.filter(
      (advertisement) => normalizeStatus(advertisement.status) === "closed"
    ).length;
    const totalApplicants = advertisements.reduce(
      (sum, advertisement) => sum + Number(advertisement.applicantsCount || 0),
      0
    );

    return [
      {
        id: "total-ads",
        label: "Total Advertisements",
        value: total,
        icon: BriefcaseBusiness,
        badgeClass: "bg-primary-50 text-primary-800",
      },
      {
        id: "live-ads",
        label: "Live Advertisements",
        value: live,
        icon: Radio,
        badgeClass: "bg-emerald-50 text-emerald-700",
      },
      {
        id: "total-applicants",
        label: "Total Applicants",
        value: totalApplicants,
        icon: Users,
        badgeClass: "bg-violet-50 text-violet-700",
      },
      {
        id: "closed-ads",
        label: "Closed Advertisements",
        value: closed,
        icon: Archive,
        badgeClass: "bg-gray-100 text-gray-600",
      },
    ];
  }, [advertisements]);

  const departmentOptions = useMemo(() => {
    const values = advertisements
      .map((advertisement) => advertisement.department?.trim())
      .filter(Boolean);

    return ["All Departments", ...Array.from(new Set(values)).sort()];
  }, [advertisements]);

  const typeOptions = useMemo(() => {
    const values = advertisements
      .map((advertisement) => advertisement.employmentType?.trim())
      .filter(Boolean);

    return ["All Types", ...Array.from(new Set(values)).sort()];
  }, [advertisements]);

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.departmentLabel.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All Departments" || job.departmentLabel === department;

      const matchesType = type === "All Types" || job.typeLabel === type;

      const normalizedJobStatus = normalizeStatus(job.status);
      const matchesStatus =
        statusFilter === "All Statuses" ||
        (statusFilter === "Live" && normalizedJobStatus === "live") ||
        (statusFilter === "Closed" && normalizedJobStatus === "closed");

      return matchesSearch && matchesDepartment && matchesType && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }

      if (sortBy === "applicants-desc") {
        return Number(b.applicantsCount || 0) - Number(a.applicantsCount || 0);
      }

      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [jobs, searchTerm, department, type, statusFilter, sortBy]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDepartment("All Departments");
    setType("All Types");
    setStatusFilter("All Statuses");
    setSortBy("newest");
  }, []);

  const handleStatusChange = useCallback(
    async (advertisementId, nextStatus) => {
      setMutatingId(advertisementId);

      try {
        const response = await advertisementService.update(advertisementId, {
          status: nextStatus,
        });

        if (!response?.advertisement) {
          throw new Error(
            response?.message || "Advertisement status could not be updated."
          );
        }

        setAdvertisements((previous) =>
          previous.map((item) =>
            String(item._id) === String(advertisementId)
              ? {
                  ...item,
                  ...response.advertisement,
                  applicantsCount: item.applicantsCount ?? 0,
                }
              : item
          )
        );

        toast.success(
          nextStatus === "Live"
            ? "Advertisement reopened and is live again."
            : "Advertisement closed successfully."
        );
      } catch (mutationError) {
        toast.error(
          mutationError?.response?.data?.message ||
            mutationError?.message ||
            "Unable to update this advertisement."
        );
      } finally {
        setMutatingId(null);
      }
    },
    [toast]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget || Number(deleteTarget.applicantsCount || 0) > 0) return;

    setIsDeleting(true);

    try {
      await advertisementService.remove(deleteTarget.id);

      setAdvertisements((previous) =>
        previous.filter((item) => String(item._id) !== String(deleteTarget.id))
      );

      toast.success("Advertisement deleted permanently.");
      setDeleteTarget(null);
    } catch (deleteError) {
      toast.error(
        deleteError?.response?.data?.message ||
          deleteError?.message ||
          "Unable to delete this advertisement."
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, toast]);

  return (
    <div className="flex w-full flex-col gap-6">
      <AdvertisementPageHeader organization={{ name: organization?.name || "Your" }} />

      <AdvertisementStatMetricsOverview stats={stats} />

      <AdvertisementFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        departmentValue={department}
        onDepartmentChange={setDepartment}
        departments={departmentOptions}
        typeValue={type}
        onTypeChange={setType}
        types={typeOptions}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        sortValue={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[300px] animate-pulse rounded-xl border border-secondary-200 bg-secondary-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => loadAdvertisements()}
            className="mt-3 rounded-xl bg-primary-800 px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <AdvertisementGrid
          jobs={filteredJobs}
          createTo={advertisementPageHeader.ctaTo}
          mutatingId={mutatingId}
          onRequestDelete={setDeleteTarget}
          onStatusChange={handleStatusChange}
        />
      )}

      <DeleteAdvertisementModal
        open={Boolean(deleteTarget)}
        advertisement={deleteTarget}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
