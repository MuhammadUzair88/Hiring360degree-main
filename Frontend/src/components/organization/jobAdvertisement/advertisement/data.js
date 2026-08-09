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
