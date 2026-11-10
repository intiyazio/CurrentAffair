import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  Building2,
} from 'lucide-react';
import type { CurrentAffair } from '../types/news';
import { formatArticleDateShort, formatRelativeTime } from '../utils/dateUtils';
import { GS_PAPERS } from '../utils/filterUtils';

interface NewsCardProps {
  article: CurrentAffair;
  isBookmarked: boolean;
  onToggleBookmark: (article: CurrentAffair) => void;
  onSelectArticle: (article: CurrentAffair) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  isBookmarked,
  onToggleBookmark,
  onSelectArticle,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const dateShort = formatArticleDateShort(article.publishedAt);
  const relativeTime = formatRelativeTime(article.publishedAt);

  const getGSPaperColor = (paperCode: string) => {
    const match = GS_PAPERS.find((p) => p.code === paperCode);
    return match ? match.color : '#01484a';
  };

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: isLight
            ? '0 12px 24px -10px rgba(1, 72, 74, 0.12), 0 4px 6px -2px rgba(1, 72, 74, 0.04)'
            : '0 12px 24px -10px rgba(0, 0, 0, 0.5)',
          borderColor: isLight ? 'rgba(1, 72, 74, 0.3)' : 'rgba(45, 212, 191, 0.3)',
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.75,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 2.75 },
        }}
      >
        {/* Source & Bookmark Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1.5,
          }}
        >
          {/* Source Tag */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Building2 size={14} color="#01484a" />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: isLight ? '#01484a' : '#2dd4bf',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              {article.source}
            </Typography>
          </Box>

          {/* Bookmark Button */}
          <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Save for Revision'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(article);
              }}
              sx={{
                color: isBookmarked ? '#d97706' : 'text.disabled',
                p: 0.75,
                '&:hover': {
                  color: isBookmarked ? '#b45309' : '#01484a',
                  backgroundColor: 'rgba(1, 72, 74, 0.06)',
                },
              }}
              aria-label={isBookmarked ? 'Saved to bookmarks' : 'Save article'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Headline */}
        <Typography
          variant="h6"
          component="h2"
          onClick={() => onSelectArticle(article)}
          sx={{
            fontWeight: 700,
            fontSize: '1.08rem',
            lineHeight: 1.4,
            cursor: 'pointer',
            mb: 1.25,
            color: 'text.primary',
            '&:hover': {
              color: isLight ? '#01484a' : '#2dd4bf',
            },
          }}
        >
          {article.title}
        </Typography>

        {/* Short Description */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.6,
            mb: 2,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.description}
        </Typography>

        {/* UPSC Meta Tags: GS Papers & Category */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.75 }}>
          {/* Category Chip */}
          <Chip
            label={article.category}
            size="small"
            sx={{
              backgroundColor: isLight ? 'rgba(1, 72, 74, 0.08)' : 'rgba(45, 212, 191, 0.12)',
              color: isLight ? '#01484a' : '#5eead4',
              fontWeight: 600,
              fontSize: '0.73rem',
              height: 24,
            }}
          />

          {/* GS Papers */}
          {article.gsPaper.map((paper) => (
            <Chip
              key={paper}
              label={paper}
              size="small"
              sx={{
                border: `1px solid ${getGSPaperColor(paper)}33`,
                backgroundColor: `${getGSPaperColor(paper)}12`,
                color: getGSPaperColor(paper),
                fontWeight: 600,
                fontSize: '0.73rem',
                height: 24,
              }}
            />
          ))}

          {/* Prelims & Mains Pills */}
          {article.prelimsRelevant && (
            <Chip
              label="Prelims"
              size="small"
              variant="outlined"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#0284c7',
                borderColor: '#0284c7',
              }}
            />
          )}

          {article.mainsRelevant && (
            <Chip
              label="Mains"
              size="small"
              variant="outlined"
              sx={{
                height: 22,
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#d97706',
                borderColor: '#d97706',
              }}
            />
          )}
        </Box>

        {/* Bottom Bar: Publication Date & Read More Link */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            mt: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, color: 'text.secondary' }}>
            <Clock size={13} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
              {relativeTime || dateShort}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              onClick={() => onSelectArticle(article)}
              sx={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: isLight ? '#01484a' : '#2dd4bf',
                p: '3px 8px',
                minWidth: 'auto',
              }}
            >
              UPSC Notes
            </Button>

            <Tooltip title="Read original verified report at source portal">
              <Button
                component="a"
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                endIcon={<ExternalLink size={13} />}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  p: '3px 8px',
                  minWidth: 'auto',
                  '&:hover': {
                    color: isLight ? '#01484a' : '#ffffff',
                  },
                }}
              >
                Source
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
