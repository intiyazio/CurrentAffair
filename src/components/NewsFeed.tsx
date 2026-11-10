import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  RotateCcw,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import type { CurrentAffair, FilterState, RelevanceFilter, TimeframeFilter } from '../types/news';
import { NewsCard } from './NewsCard';
import { SearchBar } from './SearchBar';
import { UPSC_CATEGORIES, GS_PAPERS, filterArticles } from '../utils/filterUtils';

interface NewsFeedProps {
  articles: CurrentAffair[];
  loading: boolean;
  filters: FilterState;
  onFilterChange: (updater: (prev: FilterState) => FilterState) => void;
  onResetFilters: () => void;
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: CurrentAffair) => void;
  onSelectArticle: (article: CurrentAffair) => void;
  sourcesList: string[];
}

const PAGE_SIZE = 12;

export const NewsFeed: React.FC<NewsFeedProps> = ({
  articles,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  sourcesList,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [displayCount, setDisplayCount] = useState<number>(PAGE_SIZE);

  // Filter articles memoized
  const filteredArticles = useMemo(() => {
    return filterArticles(articles, filters);
  }, [articles, filters]);

  // Reset pagination when any filter changes
  React.useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [filters]);

  const visibleArticles = filteredArticles.slice(0, displayCount);
  const hasMore = displayCount < filteredArticles.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

  const handleRelevanceChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRelevance: RelevanceFilter | null
  ) => {
    if (newRelevance !== null) {
      onFilterChange((prev) => ({ ...prev, relevance: newRelevance }));
    }
  };

  const isFiltered =
    Boolean(filters.searchQuery) ||
    filters.category !== 'All' ||
    filters.gsPaper !== 'All' ||
    filters.source !== 'All' ||
    filters.timeframe !== 'all' ||
    filters.relevance !== 'all';

  return (
    <Box id="feed" sx={{ py: 4 }}>
      {/* Section Title */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
          Daily Current Affairs Feed
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Chronological, unedited news stream from verified primary sources mapped with UPSC syllabus tags.
        </Typography>
      </Box>

      {/* Filter Control Bar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          mb: 4,
        }}
      >
        {/* Quick Search within feed */}
        <Box sx={{ mb: 2 }}>
          <SearchBar
            value={filters.searchQuery}
            onChange={(q) => onFilterChange((prev) => ({ ...prev, searchQuery: q }))}
            placeholder="Search within current affairs feed..."
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 2,
          }}
        >
          {/* 1. Category Dropdown */}
          <FormControl size="small" fullWidth>
            <InputLabel id="category-filter-label">UPSC Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="UPSC Category"
              onChange={(e) =>
                onFilterChange((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <MenuItem value="All">All Categories</MenuItem>
              {UPSC_CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 2. GS Paper Dropdown */}
          <FormControl size="small" fullWidth>
            <InputLabel id="gs-filter-label">GS Paper</InputLabel>
            <Select
              labelId="gs-filter-label"
              value={filters.gsPaper}
              label="GS Paper"
              onChange={(e) =>
                onFilterChange((prev) => ({ ...prev, gsPaper: e.target.value }))
              }
            >
              <MenuItem value="All">All GS Papers</MenuItem>
              {GS_PAPERS.map((paper) => (
                <MenuItem key={paper.code} value={paper.code}>
                  {paper.code}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 3. Source Dropdown */}
          <FormControl size="small" fullWidth>
            <InputLabel id="source-filter-label">News Source</InputLabel>
            <Select
              labelId="source-filter-label"
              value={filters.source}
              label="News Source"
              onChange={(e) =>
                onFilterChange((prev) => ({ ...prev, source: e.target.value }))
              }
            >
              <MenuItem value="All">All Official & Media Sources</MenuItem>
              {sourcesList.map((src) => (
                <MenuItem key={src} value={src}>
                  {src}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 4. Timeframe Dropdown */}
          <FormControl size="small" fullWidth>
            <InputLabel id="time-filter-label">Timeframe</InputLabel>
            <Select
              labelId="time-filter-label"
              value={filters.timeframe}
              label="Timeframe"
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  timeframe: e.target.value as TimeframeFilter,
                }))
              }
            >
              <MenuItem value="all">All Available (30 Days)</MenuItem>
              <MenuItem value="today">Today's News Only</MenuItem>
              <MenuItem value="3days">Past 3 Days</MenuItem>
              <MenuItem value="7days">Past 7 Days</MenuItem>
              <MenuItem value="month">Past 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Second Row: Prelims/Mains Toggle + Clear Filters */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            sm: { alignItems: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Prelims vs Mains Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              Relevance:
            </Typography>
            <ToggleButtonGroup
              size="small"
              value={filters.relevance}
              exclusive
              onChange={handleRelevanceChange}
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'none',
                },
              }}
            >
              <ToggleButton value="all">All Stages</ToggleButton>
              <ToggleButton value="prelims">Prelims High-Yield</ToggleButton>
              <ToggleButton value="mains">Mains Analytical</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Reset Filters Button */}
          {isFiltered && (
            <Button
              size="small"
              onClick={onResetFilters}
              startIcon={<RotateCcw size={14} />}
              color="inherit"
              sx={{
                fontSize: '0.8rem',
                color: 'text.secondary',
                alignSelf: { xs: 'flex-start', sm: 'center' },
              }}
            >
              Reset All Filters
            </Button>
          )}
        </Box>
      </Paper>

      {/* Results Header Status */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
          Showing{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {visibleArticles.length}
          </Box>{' '}
          of{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {filteredArticles.length}
          </Box>{' '}
          articles
          {isFiltered && ' (filtered)'}
        </Typography>

        {filters.category !== 'All' && (
          <Chip
            label={`Category: ${filters.category}`}
            size="small"
            onDelete={() => onFilterChange((prev) => ({ ...prev, category: 'All' }))}
            sx={{ fontWeight: 600 }}
          />
        )}

        {filters.gsPaper !== 'All' && (
          <Chip
            label={`Paper: ${filters.gsPaper}`}
            size="small"
            onDelete={() => onFilterChange((prev) => ({ ...prev, gsPaper: 'All' }))}
            sx={{ fontWeight: 600 }}
          />
        )}
      </Box>

      {/* Loading Skeletons */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {Array.from({ length: 6 }).map((_, idx) => (
            <Paper key={idx} sx={{ p: 3, borderRadius: 3 }}>
              <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1.5 }} />
              <Skeleton variant="text" width="90%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1.5, mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredArticles.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'rgba(1, 72, 74, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#01484a',
              mx: 'auto',
              mb: 2,
            }}
          >
            <AlertCircle size={24} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Articles Found
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 460, mx: 'auto' }}>
            No current affairs matched your active search query and filter criteria. Try clearing
            filters or adjusting your search term.
          </Typography>
          <Button variant="outlined" onClick={onResetFilters}>
            Clear All Filters
          </Button>
        </Paper>
      )}

      {/* Articles Grid */}
      {!loading && filteredArticles.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {visibleArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              isBookmarked={isBookmarked(article.id)}
              onToggleBookmark={onToggleBookmark}
              onSelectArticle={onSelectArticle}
            />
          ))}
        </Box>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            endIcon={<ChevronDown size={16} />}
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: '0.92rem',
              borderColor: isLight ? '#01484a' : '#2dd4bf',
              color: isLight ? '#01484a' : '#2dd4bf',
              '&:hover': {
                borderColor: isLight ? '#01484a' : '#2dd4bf',
                backgroundColor: isLight ? 'rgba(1, 72, 74, 0.05)' : 'rgba(45, 212, 191, 0.08)',
              },
            }}
          >
            Load More Articles ({filteredArticles.length - displayCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
};
