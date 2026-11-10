import React from 'react';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { CurrentAffair } from '../types/news';
import { NewsCard } from './NewsCard';
import { useLanguage } from '../context/LanguageContext';

interface TodaysHighlightsProps {
  articles: CurrentAffair[];
  isBookmarked: (id: string) => boolean;
  onToggleBookmark: (article: CurrentAffair) => void;
  onSelectArticle: (article: CurrentAffair) => void;
  onViewAllClick: () => void;
}

export const TodaysHighlights: React.FC<TodaysHighlightsProps> = ({
  articles,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
  onViewAllClick,
}) => {
  const { t } = useLanguage();

  // Pick top 6 recent high-yield articles (latest first)
  const highlightArticles = React.useMemo(() => {
    return articles.slice(0, 6);
  }, [articles]);

  if (highlightArticles.length === 0) return null;

  return (
    <Box id="today" sx={{ py: 4 }}>
      {/* Section Header */}
      <Box
        sx={{
          mb: 3.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          sm: { alignItems: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#01484a', mb: 0.5 }}>
            <Sparkles size={20} color="#d97706" />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t('highlightsTitle')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('highlightsSubtitle')}
          </Typography>
        </Box>

        <Button
          variant="text"
          onClick={onViewAllClick}
          endIcon={<ArrowRight size={16} />}
          sx={{
            fontWeight: 700,
            alignSelf: { xs: 'flex-start', sm: 'center' },
            color: '#01484a',
          }}
        >
          {t('viewAllButton')} ({articles.length})
        </Button>
      </Box>

      {/* Grid of Highlight Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 2.5,
        }}
      >
        {highlightArticles.map((article) => (
          <NewsCard
            key={`highlight-${article.id}`}
            article={article}
            isBookmarked={isBookmarked(article.id)}
            onToggleBookmark={onToggleBookmark}
            onSelectArticle={onSelectArticle}
          />
        ))}
      </Box>
    </Box>
  );
};
