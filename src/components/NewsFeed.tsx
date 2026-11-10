import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
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

interface GSPaperOption {
  code: string;
  label: string;
}

interface TimeframeOption {
  value: TimeframeFilter;
  label: string;
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

  // 1. Category Options
  const categoryOptions = useMemo(() => {
    return ['All Categories', ...UPSC_CATEGORIES];
  }, []);

  const selectedCategoryValue =
    filters.category === 'All' ? 'All Categories' : filters.category;

  // 2. GS Paper Options
  const gsPaperOptions: GSPaperOption[] = useMemo(() => {
    return [
      { code: 'All', label: 'All GS Papers' },
      ...GS_PAPERS.map((p) => ({
        code: p.code,
        label: `${p.code} – ${p.shortDesc.split(',')[0].trim()}`,
      })),
    ];
  }, []);

  const selectedGSPaperOption =
    gsPaperOptions.find((p) => p.code === filters.gsPaper) || gsPaperOptions[0];

  // 3. Source Options
  const sourceOptions = useMemo(() => {
    return ['All Sources', ...sourcesList];
  }, [sourcesList]);

  const selectedSourceValue =
    filters.source === 'All' ? 'All Sources' : filters.source;

  // 4. Timeframe Options
  const timeframeOptions: TimeframeOption[] = useMemo(() => {
    return [
      { value: 'all', label: 'All Available (30 Days)' },
      { value: 'today', label: "Today's News Only" },
      { value: '3days', label: 'Past 3 Days' },
      { value: '7days', label: 'Past 7 Days' },
      { value: 'month', label: 'Past 30 Days' },
    ];
  }, []);

  const selectedTimeframeOption =
    timeframeOptions.find((t) => t.value === filters.timeframe) || timeframeOptions[0];

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

      {/* Filter Control Bar with Autocomplete Dropdowns */}
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
            placeholder="Search keywords, headlines, schemes, judicial rulings..."
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
          {/* 1. Category Autocomplete Searchable Dropdown */}
          <Autocomplete
            size="small"
            autoHighlight
            options={categoryOptions}
            value={selectedCategoryValue}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                category: !newValue || newValue === 'All Categories' ? 'All' : newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="UPSC Category"
                placeholder="Type to search category..."
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />

          {/* 2. GS Paper Autocomplete Searchable Dropdown */}
          <Autocomplete
            size="small"
            autoHighlight
            options={gsPaperOptions}
            getOptionLabel={(option) => option.label}
            value={selectedGSPaperOption}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                gsPaper: newValue ? newValue.code : 'All',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="GS Paper"
                placeholder="Type to search paper..."
              />
            )}
            isOptionEqualToValue={(option, value) => option.code === value.code}
          />

          {/* 3. Source Autocomplete Searchable Dropdown */}
          <Autocomplete
            size="small"
            autoHighlight
            options={sourceOptions}
            value={selectedSourceValue}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                source: !newValue || newValue === 'All Sources' ? 'All' : newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="News Source"
                placeholder="Type to search source..."
              />
            )}
            isOptionEqualToValue={(option, value) => option === value}
          />

          {/* 4. Timeframe Autocomplete Searchable Dropdown */}
          <Autocomplete
            size="small"
            autoHighlight
            options={timeframeOptions}
            getOptionLabel={(option) => option.label}
            value={selectedTimeframeOption}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                timeframe: newValue ? newValue.value : 'all',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Timeframe"
                placeholder="Type to search timeframe..."
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />
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

        {filters.source !== 'All' && (
          <Chip
            label={`Source: ${filters.source}`}
            size="small"
            onDelete={() => onFilterChange((prev) => ({ ...prev, source: 'All' }))}
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
