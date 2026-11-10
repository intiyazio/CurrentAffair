import { useState, useEffect, useCallback } from 'react';
import type { NewsDataPayload } from '../types/news';
import { fetchCurrentAffairs } from '../services/newsService';
import { isDataStale } from '../utils/dateUtils';

export function useCurrentAffairs() {
  const [data, setData] = useState<NewsDataPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchCurrentAffairs();
      setData(result);
      setLastFetchTime(new Date());
    } catch (err) {
      console.error('Error fetching current affairs data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not load current affairs. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stale = data ? isDataStale(data.lastUpdated) : false;

  return {
    data,
    articles: data?.articles || [],
    sources: data?.sources || [],
    lastUpdated: data?.lastUpdated || null,
    totalArticles: data?.totalArticles || 0,
    loading,
    error,
    isStale: stale,
    lastFetchTime,
    refetch: loadData,
  };
}
