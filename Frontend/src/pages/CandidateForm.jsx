import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CandidateFormOverview, fetchCandidateJob } from "../components/organization/candidateForm";

export default function CandidateForm() {
  const { id } = useParams();

  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        // Mock fetch from data.js — no config/api needed yet.
        // Swap for `api.get(`/api/form/apply/${id}`)` once your
        // backend + config/api file are wired up.
        const { job } = await fetchCandidateJob(id);
        if (!cancelled) setSelectedJob(job);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load job");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadJob();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // All loading / error / loaded / submitted states live inside
  // CandidateFormOverview — this page's only job is fetching the job
  // by id and handing it down as a prop.
  return <CandidateFormOverview job={selectedJob} loading={loading} error={error} />;
}