/** Breadcrumb, title, subtitle and "Post New Job" CTA at the top of the page. */
import {
  Briefcase,
  Users,
  CalendarCheck,
  FileText,
  Clock,
  PlusCircle,
  UserPlus,
  Share2,
} from "lucide-react";


// Organization info — comes from backend, shared across all pages
export const organizationData = {
  id: 1,
  name: "Grainup",
};

// Advertisement page specific content
export const advertisementPageHeader = {
  title: "Advertisements",
  subtitle: "Manage and track your active job postings",
  ctaLabel: "Post New Job",
  ctaTo: "/advertisement/add",
};


/**
 * Options rendered in the department / type filter selects.
 * The first entry of each list is treated as "no filter applied".
 */
export const advertisementFilters = {
    departments: ["All Departments", "Design", "Engineering", "Growth", "Marketing", "Sales", "Tax"],
  types: ["All Types", "Full-Time", "Part-Time", "Internship", "Contract"],
};

/**
 * Job postings rendered as cards in the AdvertisementGrid.
 * accentTextClass/accentBgClass vary only in SHADE (600→900 of primary),
 * never in hue, so every card stays on the primary/secondary palette
 * while still reading as visually distinct per department.
 */
