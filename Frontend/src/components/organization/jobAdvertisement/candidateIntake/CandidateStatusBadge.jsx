import React from "react";
import { CANDIDATE_STATUS } from "./data";

const STATUS_STYLES = {
  [CANDIDATE_STATUS.PENDING]: "bg-warning-50 text-warning-700 border-warning-200",
  [CANDIDATE_STATUS.BOOKMARKED]: "bg-info-50 text-info-700 border-info-200",
  [CANDIDATE_STATUS.SHORTLISTED]: "bg-success-50 text-success-700 border-success-200",
};

/** Small pill used on cards, the reject modal, and the drawer header. */
export default function CandidateStatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES[CANDIDATE_STATUS.PENDING];

  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 ${style}`}>{status}</span>
  );
}