import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { CandidateFormOverview } from "../components/organization/candidateForm";
import { useApplication } from "../context/ApplicationContext";
import candidateService from "../services/candidateService";
import { extractErrorMessage } from "../services/apiClient";

export default function CandidateForm() {
  const { id } = useParams();
  const { submitApplication } = useApplication();

  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await candidateService.getJobById(id);
        if (!cancelled) setSelectedJob(data.job);
      } catch (err) {
        if (!cancelled) setError(extractErrorMessage(err, "Failed to load this job posting."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadJob();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // CandidateFormStructure submits { name, email, phone, resume, organizationId } —
  // map that onto submitApplication's contract, adding the job id from the route.
  const handleSubmit = ({ name, email, phone, resume, organizationId }) =>
    submitApplication({
      name,
      email,
      phone,
      file: resume,
      advertisementId: id,
      organizationId,
    });

  // All loading / error / loaded / submitted states live inside
  // CandidateFormOverview — this page's only job is fetching the job
  // by id and handing it down (plus the real submit handler) as props.
  return (
    <CandidateFormOverview job={selectedJob} loading={loading} error={error} onSubmit={handleSubmit} />
  );
}
