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
import { useLanguage } from '../context/LanguageContext';

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

interface SelectOption {
  value: string;
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
  const { t, translateCategory, translateGSPaper, translateGSPaperDesc, translateSource } = useLanguage();
  const [displayCount, setDisplayCount] = useState<number>(PAGE_SIZE);

  // 1. Category Options
  const categoryOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'All', label: t('allCategories') },
      ...UPSC_CATEGORIES.map((cat) => ({
        value: cat,
        label: translateCategory(cat),
      })),
    ];
  }, [t, translateCategory]);

  const selectedCategoryOption =
    categoryOptions.find((c) => c.value === filters.category) || categoryOptions[0];

  // 2. GS Paper Options
  const gsPaperOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'All', label: t('showAllPapers') },
      ...GS_PAPERS.map((p) => ({
        value: p.code,
        label: `${translateGSPaper(p.code)} (${translateGSPaperDesc(p.code).split(',')[0].trim() || p.code})`,
      })),
    ];
  }, [t, translateGSPaper, translateGSPaperDesc]);

  const selectedGSPaperOption =
    gsPaperOptions.find((p) => p.value === filters.gsPaper) || gsPaperOptions[0];

  // 3. Source Options
  const sourceOptions: SelectOption[] = useMemo(() => {
    return [
      { value: 'All', label: `${t('dropdownSource')} (${t('relevanceAll')})` },
      ...sourcesList.map((src) => ({
        value: src,
        label: translateSource(src),
      })),
    ];
  }, [sourcesList, t, translateSource]);

  const selectedSourceOption =
    sourceOptions.find((s) => s.value === filters.source) || sourceOptions[0];

  // 4. Timeframe Options
  const timeframeOptions: TimeframeOption[] = useMemo(() => {
    return [
      { value: 'all', label: t('timeframeAll') },
      { value: 'today', label: t('timeframeToday') },
      { value: '3days', label: t('timeframe3Days') },
      { value: '7days', label: t('timeframe7Days') },
      { value: 'month', label: t('timeframeMonth') },
    ];
  }, [t]);

  const selectedTimeframeOption =
    timeframeOptions.find((tOpt) => tOpt.value === filters.timeframe) || timeframeOptions[0];

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
          {t('feedTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('feedSubtitle')}
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
            placeholder={t('feedSearchPlaceholder')}
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
            getOptionLabel={(option) => option.label}
            value={selectedCategoryOption}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                category: newValue ? newValue.value : 'All',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dropdownCategory')}
                placeholder={t('searchCategoryPlaceholder')}
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
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
                gsPaper: newValue ? newValue.value : 'All',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dropdownGSPaper')}
                placeholder={t('searchGSPaperPlaceholder')}
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
          />

          {/* 3. Source Autocomplete Searchable Dropdown */}
          <Autocomplete
            size="small"
            autoHighlight
            options={sourceOptions}
            getOptionLabel={(option) => option.label}
            value={selectedSourceOption}
            onChange={(_event, newValue) => {
              onFilterChange((prev) => ({
                ...prev,
                source: newValue ? newValue.value : 'All',
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dropdownSource')}
                placeholder={t('searchSourcePlaceholder')}
              />
            )}
            isOptionEqualToValue={(option, value) => option.value === value.value}
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
                label={t('dropdownTimeframe')}
                placeholder={t('searchTimeframePlaceholder')}
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
              {t('relevanceLabel')}
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
              <ToggleButton value="all">{t('relevanceAll')}</ToggleButton>
              <ToggleButton value="prelims">{t('relevancePrelims')}</ToggleButton>
              <ToggleButton value="mains">{t('relevanceMains')}</ToggleButton>
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
              {t('resetFilters')}
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
          {t('showingPrefix')}{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {visibleArticles.length}
          </Box>{' '}
          {t('showingOf')}{' '}
          <Box component="span" sx={{ color: 'text.primary', fontWeight: 700 }}>
            {filteredArticles.length}
          </Box>{' '}
          {t('showingArticles')}
          {isFiltered && ` ${t('filteredSuffix')}`}
        </Typography>

        {filters.category !== 'All' && (
          <Chip
            label={`${t('dropdownCategory')}: ${translateCategory(filters.category)}`}
            size="small"
            onDelete={() => onFilterChange((prev) => ({ ...prev, category: 'All' }))}
            sx={{ fontWeight: 600 }}
          />
        )}

        {filters.gsPaper !== 'All' && (
          <Chip
            label={`${t('dropdownGSPaper')}: ${translateGSPaper(filters.gsPaper)}`}
            size="small"
            onDelete={() => onFilterChange((prev) => ({ ...prev, gsPaper: 'All' }))}
            sx={{ fontWeight: 600 }}
          />
        )}

        {filters.source !== 'All' && (
          <Chip
            label={`${t('dropdownSource')}: ${translateSource(filters.source)}`}
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
            {t('noArticlesFound')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 460, mx: 'auto' }}>
            {t('noArticlesDesc')}
          </Typography>
          <Button variant="outlined" onClick={onResetFilters}>
            {t('clearAllFilters')}
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
            {t('loadMore')} ({filteredArticles.length - displayCount} {t('remainingSuffix')})
          </Button>
        </Box>
      )}
    </Box>
  );
};
