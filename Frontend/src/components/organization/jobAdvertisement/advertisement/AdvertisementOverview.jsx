import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Briefcase,
  FileText,
  Radio,
  XCircle,
} from "lucide-react";

import AdvertisementPageHeader from "./AdvertisementPageHeader";
import AdvertisementFilterBar from "./AdvertisementFilterBar";
import AdvertisementGrid from "./AdvertisementGrid";

import { StatMetricsOverview } from "../../dashboard";

import { useAuth } from "../../../../context/AuthContext";
import advertisementService from "../../../../services/advertisementService";

const advertisementPageHeader = {
  title: "Advertisements",
  subtitle: "Manage and track your active job postings",
  ctaLabel: "Post New Job",
  ctaTo: "/advertisement/add",
};

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function mapAdvertisementToCard(advertisement) {
  return {
    id: advertisement._id,

    title: advertisement.jobTitle || "Untitled Job",

    departmentLabel:
      advertisement.department || "Other",

    typeLabel:
      advertisement.employmentType || "Not specified",

    company: "",

    location:
      advertisement.location ||
      advertisement.workMode ||
      "Not specified",

    salary: advertisement.salary || null,

    postedDate: formatDate(advertisement.createdAt),

    endDate: formatDate(advertisement.deadline),

    tags: Array.isArray(advertisement.skills)
      ? advertisement.skills
      : [],

    applicantsCount:
      advertisement.applicantsCount ?? 0,

    status: advertisement.status,

    workMode: advertisement.workMode,

    experience: advertisement.experience,

    description: advertisement.description,

    accentTextClass: "text-primary-800",
    accentBgClass: "bg-primary-800/10",
  };
}

export default function AdvertisementOverview() {
  const { organization } = useAuth();

  const [advertisements, setAdvertisements] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] =
    useState("All Departments");
  const [type, setType] =
    useState("All Types");

  // --------------------------------------------------
  // REAL BACKEND DATA
  // --------------------------------------------------

  const loadAdvertisements = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setIsLoading(true);
        }

        const response =
          await advertisementService.getAll();

        if (response?.success) {
          setAdvertisements(
            Array.isArray(response.advertisements)
              ? response.advertisements
              : []
          );

          setError("");
        } else {
          setAdvertisements([]);
          setError(
            response?.message ||
              "Unable to load advertisements."
          );
        }
      } catch (err) {
        console.error(
          "Advertisement loading error:",
          err
        );

        if (!silent) {
          setAdvertisements([]);
        }

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load advertisements."
        );
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  // Initial backend request
  useEffect(() => {
    loadAdvertisements();
  }, [loadAdvertisements]);

  // --------------------------------------------------
  // PERIODIC BACKEND REFRESH
  // --------------------------------------------------
  // REST polling. This keeps the page fresh if
  // advertisements change elsewhere.

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadAdvertisements({ silent: true });
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadAdvertisements]);

  // --------------------------------------------------
  // MAP REAL DATABASE OBJECTS → EXISTING CARD UI
  // --------------------------------------------------

  const jobs = useMemo(() => {
    return advertisements.map(
      mapAdvertisementToCard
    );
  }, [advertisements]);

  // --------------------------------------------------
  // REAL STATS
  // --------------------------------------------------

  const stats = useMemo(() => {
    const total = advertisements.length;

    const live = advertisements.filter(
      (advertisement) =>
        normalizeStatus(advertisement.status) ===
        "live"
    ).length;

    const draft = advertisements.filter(
      (advertisement) =>
        normalizeStatus(advertisement.status) ===
        "draft"
    ).length;

    const closed = advertisements.filter(
      (advertisement) =>
        normalizeStatus(advertisement.status) ===
        "closed"
    ).length;

    return [
      {
        id: "total-ads",
        label: "Total Ads",
        value: String(total),
        icon: Briefcase,
        badgeClass:
          "bg-primary-50 text-primary-800",
      },
      {
        id: "published",
        label: "Published",
        value: String(live),
        icon: Radio,
        badgeClass:
          "bg-primary-100 text-primary-600",
      },
      {
        id: "draft",
        label: "Draft",
        value: String(draft),
        icon: FileText,
        badgeClass:
          "bg-primary-100 text-primary-900",
      },
      {
        id: "closed",
        label: "Closed",
        value: String(closed),
        icon: XCircle,
        badgeClass:
          "bg-secondary-200 text-primary-700",
      },
    ];
  }, [advertisements]);

  // --------------------------------------------------
  // FILTER OPTIONS FROM REAL DATABASE RECORDS
  // --------------------------------------------------

  const departmentOptions = useMemo(() => {
    const values = advertisements
      .map((advertisement) =>
        advertisement.department?.trim()
      )
      .filter(Boolean);

    return [
      "All Departments",
      ...Array.from(new Set(values)).sort(),
    ];
  }, [advertisements]);

  const typeOptions = useMemo(() => {
    const values = advertisements
      .map((advertisement) =>
        advertisement.employmentType?.trim()
      )
      .filter(Boolean);

    return [
      "All Types",
      ...Array.from(new Set(values)).sort(),
    ];
  }, [advertisements]);

  // --------------------------------------------------
  // CLIENT-SIDE FILTERING OF REAL DATA
  // --------------------------------------------------

  const filteredJobs = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title
          ?.toLowerCase()
          .includes(query) ||
        job.departmentLabel
          ?.toLowerCase()
          .includes(query) ||
        job.location
          ?.toLowerCase()
          .includes(query);

      const matchesDepartment =
        department === "All Departments" ||
        job.departmentLabel === department;

      const matchesType =
        type === "All Types" ||
        job.typeLabel === type;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesType
      );
    });
  }, [
    jobs,
    searchTerm,
    department,
    type,
  ]);

  return (
    <div className="w-full flex flex-col gap-6">
      <AdvertisementPageHeader
        organization={{
          name:
            organization?.name ||
            "Your",
        }}
      />

      <StatMetricsOverview stats={stats} />

      <AdvertisementFilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}

        departmentValue={department}
        onDepartmentChange={setDepartment}
        departments={departmentOptions}

        typeValue={type}
        onTypeChange={setType}
        types={typeOptions}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-56 animate-pulse rounded-xl bg-secondary-200"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadAdvertisements()
            }
            className="mt-3 px-4 py-2 rounded-lg bg-primary-800 text-white text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      ) : (
        <AdvertisementGrid
          jobs={filteredJobs}
          createTo={
            advertisementPageHeader.ctaTo
          }
        />
      )}
    </div>
  );
}