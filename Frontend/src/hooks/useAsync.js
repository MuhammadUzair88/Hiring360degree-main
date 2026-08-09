// src/hooks/useAsync.js
//
// Standardizes the loading / error / data trio that almost every page needs
// when it talks to the API service layer. Two flavors are exported:
//
//   useAsync(asyncFn, deps)   -> runs automatically on mount / when deps change
//   useAsyncCallback(asyncFn) -> runs only when you call `execute(...)` yourself
//                                 (forms, button actions, mutations)
//
import { useCallback, useEffect, useRef, useState } from "react";
import { extractErrorMessage } from "../services/apiClient";

export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  const run = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      if (isMounted.current) setData(result);
      return result;
    } catch (err) {
      if (isMounted.current) setError(extractErrorMessage(err));
      throw err;
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    isMounted.current = true;
    run().catch(() => {});
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, setData, error, isLoading, refetch: run };
}

export function useAsyncCallback(asyncFn) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        return await asyncFn(...args);
      } catch (err) {
        setError(extractErrorMessage(err));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn]
  );

  return { execute, isLoading, error, setError };
}
