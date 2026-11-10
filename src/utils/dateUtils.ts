import { format, formatDistanceToNow, isToday as dfIsToday, subDays, parseISO, isValid } from 'date-fns';

export function safeParseDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  try {
    const parsed = parseISO(dateStr);
    if (isValid(parsed)) return parsed;
    const fallback = new Date(dateStr);
    return isValid(fallback) ? fallback : new Date();
  } catch {
    return new Date();
  }
}

export function formatArticleDate(dateStr: string): string {
  try {
    const d = safeParseDate(dateStr);
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return dateStr;
  }
}

export function formatArticleDateShort(dateStr: string): string {
  try {
    const d = safeParseDate(dateStr);
    return format(d, 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const d = safeParseDate(dateStr);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '';
  }
}

export function formatTodayHeadline(): string {
  try {
    return format(new Date(), 'EEEE, dd MMMM yyyy');
  } catch {
    return new Date().toLocaleDateString();
  }
}

export function isDataStale(lastUpdatedStr: string, maxHours = 30): boolean {
  if (!lastUpdatedStr) return true;
  try {
    const d = safeParseDate(lastUpdatedStr);
    const now = new Date();
    const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    return diffHours > maxHours;
  } catch {
    return true;
  }
}

export function matchesTimeframe(
  dateStr: string,
  timeframe: 'all' | 'today' | '3days' | '7days' | 'month'
): boolean {
  if (timeframe === 'all') return true;
  const d = safeParseDate(dateStr);
  const now = new Date();

  if (timeframe === 'today') {
    return dfIsToday(d);
  }
  if (timeframe === '3days') {
    return d >= subDays(now, 3);
  }
  if (timeframe === '7days') {
    return d >= subDays(now, 7);
  }
  if (timeframe === 'month') {
    return d >= subDays(now, 30);
  }
  return true;
}
