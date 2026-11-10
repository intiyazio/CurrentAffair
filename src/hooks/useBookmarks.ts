import { useState, useEffect, useCallback } from 'react';
import type { CurrentAffair } from '../types/news';

const STORAGE_KEY = 'upsc_current_affairs_bookmarks_v1';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<CurrentAffair[]>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      console.warn('Failed to load bookmarks from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id: string) => {
      return bookmarks.some((item) => item.id === id);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback((article: CurrentAffair) => {
    setBookmarks((prev) => {
      const exists = prev.some((item) => item.id === article.id);
      if (exists) {
        return prev.filter((item) => item.id !== article.id);
      } else {
        return [article, ...prev];
      }
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
    bookmarkCount: bookmarks.length,
  };
}
