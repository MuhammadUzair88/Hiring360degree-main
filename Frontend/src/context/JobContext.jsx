// src/context/JobContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import advertisementService from "../services/advertisementService";
import { extractErrorMessage } from "../services/apiClient";

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const params = useParams();
  const jobId = params.id || params.jobId || null;
  const [job, setJob] = useState(undefined);
  const [pamphlet, setPamphlet] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) {
      setJob(null);
      setPamphlet(null);
      setApplicantCount(0);
      return;
    }

    setJob(undefined);
    setError(null);
    try {
      const data = await advertisementService.getById(jobId);
      const advertisement = data?.advertisement || null;
      setJob(advertisement);
      setPamphlet(data?.pamphlet || null);
      setApplicantCount(Number(data?.applicantsCount ?? advertisement?.applicantsCount ?? 0) || 0);
    } catch (err) {
      setJob(null);
      setPamphlet(null);
      setApplicantCount(0);
      setError(extractErrorMessage(err, "Failed to load this job posting."));
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const updateJobLocal = useCallback((patch) => {
    setJob((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const updateApplicantCount = useCallback((count) => {
    const next = Math.max(0, Number(count) || 0);
    setApplicantCount(next);
    setJob((current) => current ? { ...current, applicantsCount: next } : current);
  }, []);

  return (
    <JobContext.Provider value={{
      jobId,
      job,
      pamphlet,
      applicantCount,
      error,
      isLoading: job === undefined,
      refetchJob: fetchJob,
      updateJobLocal,
      updateApplicantCount,
    }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJob must be used within a JobProvider");
  return context;
}
