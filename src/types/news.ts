/**
 * types/news.ts
 * Type definitions for UPSC Current Affairs.
 */

export interface CurrentAffair {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: string;
  gsPaper: string[];
  prelimsRelevant: boolean;
  mainsRelevant: boolean;
  keywords: string[];
}

export interface SourceSummary {
  name: string;
  latestFetched: number;
  retainedTotal: number;
  status: 'active' | 'degraded' | 'failed' | 'unknown';
}

export interface NewsDataPayload {
  lastUpdated: string;
  totalArticles: number;
  retentionDays: number;
  sources: SourceSummary[];
  articles: CurrentAffair[];
}

export type RelevanceFilter = 'all' | 'prelims' | 'mains';

export type TimeframeFilter = 'all' | 'today' | '3days' | '7days' | 'month';

export interface FilterState {
  searchQuery: string;
  category: string;
  gsPaper: string;
  source: string;
  timeframe: TimeframeFilter;
  relevance: RelevanceFilter;
}

export interface GSPaperInfo {
  code: string;
  title: string;
  shortDesc: string;
  topics: string[];
  color: string;
}
