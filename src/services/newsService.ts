import type { CurrentAffair, NewsDataPayload } from '../types/news';

/**
 * Resolves the static JSON path accounting for GitHub Pages subpath deployment.
 */
export function getNewsDataUrl(): string {
  const base = import.meta.env.BASE_URL || './';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}data/current-affairs.json`;
}

export async function fetchCurrentAffairs(): Promise<NewsDataPayload> {
  const url = getNewsDataUrl();
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load current affairs data (HTTP ${response.status})`);
  }

  const rawData = await response.json();

  if (Array.isArray(rawData)) {
    return {
      lastUpdated: new Date().toISOString(),
      totalArticles: rawData.length,
      retentionDays: 30,
      sources: [],
      articles: rawData,
    };
  }

  if (rawData && typeof rawData === 'object' && Array.isArray(rawData.articles)) {
    return {
      lastUpdated: rawData.lastUpdated || new Date().toISOString(),
      totalArticles: rawData.totalArticles || rawData.articles.length,
      retentionDays: rawData.retentionDays || 30,
      sources: rawData.sources || [],
      articles: rawData.articles as CurrentAffair[],
    };
  }

  throw new Error('Received unexpected data format from current affairs dataset.');
}
