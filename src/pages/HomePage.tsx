import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  Alert,
  Button,
} from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { TodaysHighlights } from '../components/TodaysHighlights';
import { CategoryFilters } from '../components/CategoryFilters';
import { GSPaperFilters } from '../components/GSPaperFilters';
import { NewsFeed } from '../components/NewsFeed';
import { SavedArticles } from '../components/SavedArticles';
import { ArticleDetails } from '../components/ArticleDetails';
import { Footer } from '../components/Footer';
import { useCurrentAffairs } from '../hooks/useCurrentAffairs';
import { useBookmarks } from '../hooks/useBookmarks';
import type { CurrentAffair, FilterState } from '../types/news';

interface HomePageProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'All',
  gsPaper: 'All',
  source: 'All',
  timeframe: 'all',
  relevance: 'all',
};

export const HomePage: React.FC<HomePageProps> = ({ mode, onToggleTheme }) => {
  const {
    articles,
    sources,
    lastUpdated,
    totalArticles,
    loading,
    error,
    isStale,
    refetch,
  } = useCurrentAffairs();

  const {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    clearBookmarks,
    bookmarkCount,
  } = useBookmarks();

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedArticle, setSelectedArticle] = useState<CurrentAffair | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Compute unique sources for the dropdown
  const sourcesList = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.source) set.add(a.source);
    }
    return Array.from(set).sort();
  }, [articles]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleQuickCategory = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    const feedEl = document.getElementById('feed');
    if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectPaper = (paper: string) => {
    setFilters((prev) => ({ ...prev, gsPaper: paper }));
    const feedEl = document.getElementById('feed');
    if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <Header
        mode={mode}
        onToggleTheme={onToggleTheme}
        bookmarkCount={bookmarkCount}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Hero Section with Search & Metrics */}
      <Hero
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        lastUpdated={lastUpdated}
        totalArticles={totalArticles}
        isStale={isStale}
        onQuickCategoryClick={handleQuickCategory}
      />

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
        {/* Error Alert if JSON failed to load */}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={refetch} startIcon={<RefreshCw size={14} />}>
                Retry
              </Button>
            }
            sx={{ mb: 4, borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Section C: Today's Important News */}
        <TodaysHighlights
          articles={articles}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onSelectArticle={setSelectedArticle}
          onViewAllClick={() => {
            const feedEl = document.getElementById('feed');
            if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Section E: UPSC Categories Filter Grid */}
        <CategoryFilters
          selectedCategory={filters.category}
          onSelectCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
          articles={articles}
        />

        {/* Section F: GS Paper Classification */}
        <GSPaperFilters
          selectedPaper={filters.gsPaper}
          onSelectPaper={handleSelectPaper}
          articles={articles}
        />

        {/* Section D: Daily Current Affairs Feed */}
        <NewsFeed
          articles={articles}
          loading={loading}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onSelectArticle={setSelectedArticle}
          sourcesList={sourcesList}
        />

        {/* Section G: Saved Articles */}
        <SavedArticles
          savedArticles={bookmarks}
          onToggleBookmark={toggleBookmark}
          onClearBookmarks={clearBookmarks}
          onSelectArticle={setSelectedArticle}
          onExploreFeed={() => {
            const feedEl = document.getElementById('feed');
            if (feedEl) feedEl.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </Container>

      {/* Section H: Article Details Modal */}
      <ArticleDetails
        article={selectedArticle}
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        isBookmarked={selectedArticle ? isBookmarked(selectedArticle.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      {/* Section I: Footer */}
      <Footer lastUpdated={lastUpdated} sources={sources} />
    </Box>
  );
};
