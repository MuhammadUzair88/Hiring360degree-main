// src/context/JobContext.jsx
//
// Every route nested under SecondaryLayout ("/advertisement/job/:id/...")
// deals with the same job. Rather than have JobOverview, Rounds,
// CandidateIntake, OfferLetter, and SecondarySidebar each fetch the
// advertisement independently, SecondaryLayout mounts this provider once
// per :id and everything below reads from it via useJob().
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import advertisementService from "../services/advertisementService";
import { extractErrorMessage } from "../services/apiClient";

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const { id } = useParams();
  const [job, setJob] = useState(undefined); // undefined = loading, null = not found
  const [pamphlet, setPamphlet] = useState(null);
  const [error, setError] = useState(null);

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setJob(undefined);
    setError(null);
    try {
      const data = await advertisementService.getById(id);
         console.log(data)
      setJob(data.advertisement || null);
      setPamphlet(data.pamphlet || null);
    } catch (err) {
      setJob(null);
      setError(extractErrorMessage(err, "Failed to load this job posting."));
    }
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const updateJobLocal = useCallback((patch) => {
    setJob((current) => (current ? { ...current, ...patch } : current));
  }, []);

  return (
    <JobContext.Provider
      value={{ jobId: id, job, pamphlet, error, isLoading: job === undefined, refetchJob: fetchJob, updateJobLocal }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJob must be used within a JobProvider");
  }
  return context;
}
