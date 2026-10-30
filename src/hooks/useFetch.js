import { useState, useEffect, useCallback, useRef } from "react";

export const useFetch = (fetchFn, deps = [], options = {}) => {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFn(...args);
        if (isMountedRef.current) setData(result);
        return result;
      } catch (err) {
        if (isMountedRef.current) setError(err);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    },
    [fetchFn],
  );

  useEffect(() => {
    isMountedRef.current = true;
    if (immediate) execute();
    return () => {
      isMountedRef.current = false;
    };
  }, deps);

  const refetch = useCallback(() => execute(), [execute]);
  return { data, loading, error, refetch, execute };
};
