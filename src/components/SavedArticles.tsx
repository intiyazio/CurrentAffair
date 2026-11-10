import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Bookmark,
  Trash2,
  Download,
  ArrowRight,
} from 'lucide-react';
import type { CurrentAffair } from '../types/news';
import { NewsCard } from './NewsCard';
import { useLanguage } from '../context/LanguageContext';

interface SavedArticlesProps {
  savedArticles: CurrentAffair[];
  onToggleBookmark: (article: CurrentAffair) => void;
  onClearBookmarks: () => void;
  onSelectArticle: (article: CurrentAffair) => void;
  onExploreFeed: () => void;
}

export const SavedArticles: React.FC<SavedArticlesProps> = ({
  savedArticles,
  onToggleBookmark,
  onClearBookmarks,
  onSelectArticle,
  onExploreFeed,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t } = useLanguage();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const handleExport = () => {
    if (savedArticles.length === 0) return;
    const exportData = savedArticles.map((a, i) => ({
      index: i + 1,
      title: a.title,
      source: a.source,
      category: a.category,
      gsPaper: a.gsPaper.join(', '),
      sourceUrl: a.sourceUrl,
      description: a.description,
      keywords: a.keywords.join(', '),
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upsc-saved-current-affairs-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box id="saved" sx={{ py: 5 }}>
      {/* Section Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          sm: { alignItems: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d97706', mb: 0.5 }}>
            <Bookmark size={22} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {t('savedTitle')} ({savedArticles.length})
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('savedSubtitle')}
          </Typography>
        </Box>

        {savedArticles.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Download size={15} />}
              onClick={handleExport}
              sx={{ borderRadius: 2 }}
            >
              {t('exportNotes')}
            </Button>

            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Trash2 size={15} />}
              onClick={() => setConfirmClearOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              {t('clearAll')}
            </Button>
          </Box>
        )}
      </Box>

      {/* Empty State */}
      {savedArticles.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            borderRadius: 4,
            border: `2px dashed ${theme.palette.divider}`,
            backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.02)',
            maxWidth: 580,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d97706',
              mx: 'auto',
              mb: 2.5,
            }}
          >
            <Bookmark size={26} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            {t('noSavedArticles')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
            {t('noSavedDesc')}
          </Typography>
          <Button
            variant="contained"
            onClick={onExploreFeed}
            endIcon={<ArrowRight size={16} />}
            sx={{ borderRadius: 2.5, px: 3, py: 1 }}
          >
            {t('browseCurrentAffairs')}
          </Button>
        </Paper>
      ) : (
        /* Saved Articles Grid */
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {savedArticles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              onSelectArticle={onSelectArticle}
            />
          ))}
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        aria-labelledby="clear-dialog-title"
      >
        <DialogTitle id="clear-dialog-title">{t('confirmClearTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirmClearDesc')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmClearOpen(false)}>{t('cancel')}</Button>
          <Button
            onClick={() => {
              onClearBookmarks();
              setConfirmClearOpen(false);
            }}
            color="error"
            variant="contained"
          >
            {t('clearAll')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
