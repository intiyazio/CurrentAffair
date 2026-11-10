import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  X as CloseIcon,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Share2,
  Calendar,
  Building2,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { CurrentAffair } from '../types/news';
import { formatArticleDate } from '../utils/dateUtils';
import { GS_PAPERS } from '../utils/filterUtils';

interface ArticleDetailsProps {
  article: CurrentAffair | null;
  open: boolean;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: CurrentAffair) => void;
}

export const ArticleDetails: React.FC<ArticleDetailsProps> = ({
  article,
  open,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isLight = theme.palette.mode === 'light';

  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${article.title}\n\nRead original: ${article.sourceUrl}\n(Via UPSC Current Affairs)`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const getGSPaperDetails = (code: string) => {
    return GS_PAPERS.find((p) => p.code === code);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: 0, sm: 3 },
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            },
          },
        }}
        aria-labelledby="article-details-title"
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1.5,
            pt: 2.5,
            px: { xs: 2.5, sm: 3.5 },
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* Source and Date Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: isLight ? '#01484a' : '#2dd4bf',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
              }}
            >
              <Building2 size={16} />
              <span>{article.source}</span>
            </Box>

            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color: 'text.secondary', fontSize: '0.8rem' }}>
              <Calendar size={14} />
              <span>{formatArticleDate(article.publishedAt)}</span>
            </Box>
          </Box>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={copied ? 'Copied link!' : 'Share / Copy'}>
              <IconButton size="small" onClick={handleShare} sx={{ p: 1 }}>
                {copied ? <Check size={18} color="#059669" /> : <Share2 size={18} />}
              </IconButton>
            </Tooltip>

            <Tooltip title={isBookmarked ? 'Remove Bookmark' : 'Save for Revision'}>
              <IconButton
                size="small"
                onClick={() => onToggleBookmark(article)}
                sx={{
                  p: 1,
                  color: isBookmarked ? '#d97706' : 'inherit',
                }}
              >
                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </IconButton>
            </Tooltip>

            <IconButton size="small" onClick={onClose} sx={{ p: 1 }}>
              <CloseIcon size={18} />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3 }}>
          {/* Article Title */}
          <Typography
            id="article-details-title"
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.35,
              color: 'text.primary',
              mb: 2.5,
            }}
          >
            {article.title}
          </Typography>

          {/* Source Excerpt Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              backgroundColor: isLight ? 'rgba(1, 72, 74, 0.03)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${theme.palette.divider}`,
              mb: 3.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#01484a', mb: 1 }}>
              <ShieldCheck size={16} />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Verified Source Communiqué
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                lineHeight: 1.7,
                fontSize: '1rem',
              }}
            >
              {article.description}
            </Typography>

            <Box sx={{ mt: 2, pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
              <Button
                component="a"
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                endIcon={<ExternalLink size={14} />}
                sx={{
                  borderColor: isLight ? '#01484a' : '#2dd4bf',
                  color: isLight ? '#01484a' : '#2dd4bf',
                  fontWeight: 600,
                }}
              >
                Read Complete Report at {article.source}
              </Button>
            </Box>
          </Paper>

          {/* UPSC Examination Linkage & Relevance */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Sparkles size={18} color="#d97706" />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                UPSC Syllabus Classification & Relevance
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>
              Classification derived objectively from article topic metadata and the official UPSC Civil
              Services Examination syllabus.
            </Typography>

            {/* Category & GS Papers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2.5 }}>
              {/* Category Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Primary Category
                </Typography>
                <Chip
                  label={article.category}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: isLight ? 'rgba(1, 72, 74, 0.1)' : 'rgba(45, 212, 191, 0.15)',
                    color: isLight ? '#01484a' : '#2dd4bf',
                  }}
                />
              </Paper>

              {/* Relevance Tier */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Exam Stage Relevance
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {article.prelimsRelevant && (
                    <Chip
                      label="Prelims High-Yield"
                      size="small"
                      sx={{ backgroundColor: '#0284c718', color: '#0284c7', fontWeight: 600 }}
                    />
                  )}
                  {article.mainsRelevant && (
                    <Chip
                      label="Mains Analytical"
                      size="small"
                      sx={{ backgroundColor: '#d9770618', color: '#d97706', fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Paper>
            </Box>

            {/* GS Papers Detail */}
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                General Studies (GS) Paper Linkages:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {article.gsPaper.map((paperCode) => {
                  const info = getGSPaperDetails(paperCode);
                  return (
                    <Box
                      key={paperCode}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: `${info?.color || '#01484a'}0d`,
                        border: `1px solid ${info?.color || '#01484a'}2b`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: info?.color || '#01484a' }}>
                          {paperCode}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          — {info?.title || ''}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        Key Areas: {info?.topics.join(' • ')}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Keywords */}
            {article.keywords && article.keywords.length > 0 && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  High-Priority Syllabus Keywords:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                  {article.keywords.map((kw) => (
                    <Chip
                      key={kw}
                      label={kw}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: theme.palette.divider,
                        fontWeight: 500,
                        fontSize: '0.78rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        {/* Dialog Actions */}
        <DialogActions
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            justifyContent: 'space-between',
          }}
        >
          <Button
            onClick={() => onToggleBookmark(article)}
            startIcon={isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            sx={{
              color: isBookmarked ? '#d97706' : 'text.primary',
              fontWeight: 600,
            }}
          >
            {isBookmarked ? 'Bookmarked' : 'Save for Revision'}
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose} variant="outlined" color="inherit">
              Close
            </Button>
            <Button
              component="a"
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              endIcon={<ExternalLink size={15} />}
            >
              Open Original Source
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        message="Article link copied to clipboard!"
      />
    </>
  );
};
