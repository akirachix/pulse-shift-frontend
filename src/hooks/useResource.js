import { useState, useEffect, useCallback } from 'react';

const useResource = (fetcher, autoFetch = true, timeout = 10000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);


    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      setError(e.message || 'Error fetching data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useResource;
