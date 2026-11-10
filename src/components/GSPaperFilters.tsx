import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { Layers, CheckCircle2 } from 'lucide-react';
import { GS_PAPERS } from '../utils/filterUtils';
import type { CurrentAffair } from '../types/news';
import { useLanguage } from '../context/LanguageContext';

interface GSPaperFiltersProps {
  selectedPaper: string;
  onSelectPaper: (paper: string) => void;
  articles: CurrentAffair[];
}

export const GSPaperFilters: React.FC<GSPaperFiltersProps> = ({
  selectedPaper,
  onSelectPaper,
  articles,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t, translateGSPaper, translateGSPaperDesc } = useLanguage();

  // Compute paper counts
  const paperCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      'GS Paper I': 0,
      'GS Paper II': 0,
      'GS Paper III': 0,
      'GS Paper IV': 0,
      Essay: 0,
    };
    for (const art of articles) {
      if (Array.isArray(art.gsPaper)) {
        for (const p of art.gsPaper) {
          if (counts[p] !== undefined) {
            counts[p]++;
          }
        }
      }
    }
    return counts;
  }, [articles]);

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          mb: 2.5,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          sm: { alignItems: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('gsPaperTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('gsPaperSubtitle')}
          </Typography>
        </Box>

        {selectedPaper !== 'All' && (
          <Button
            size="small"
            variant="outlined"
            onClick={() => onSelectPaper('All')}
            startIcon={<Layers size={14} />}
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            {t('showAllPapers')}
          </Button>
        )}
      </Box>

      {/* Grid of GS Papers */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: 2,
        }}
      >
        {GS_PAPERS.map((paper) => {
          const isSelected = selectedPaper === paper.code;
          const count = paperCounts[paper.code] || 0;

          return (
            <Paper
              key={paper.code}
              elevation={0}
              onClick={() => onSelectPaper(isSelected ? 'All' : paper.code)}
              sx={{
                p: 2.25,
                borderRadius: 3,
                cursor: 'pointer',
                border: `2px solid ${
                  isSelected ? paper.color : isLight ? theme.palette.divider : 'rgba(255, 255, 255, 0.08)'
                }`,
                backgroundColor: isSelected
                  ? `${paper.color}0a`
                  : theme.palette.background.paper,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  borderColor: paper.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 16px -4px ${paper.color}22`,
                },
              }}
            >
              <Box>
                {/* Header: Paper Code & Count */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.25,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: paper.color,
                      fontSize: '0.95rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {translateGSPaper(paper.code)}
                  </Typography>

                  <Chip
                    label={`${count} ${t('itemsCount')}`}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backgroundColor: `${paper.color}18`,
                      color: paper.color,
                    }}
                  />
                </Box>

                {/* Short Description */}
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.82rem',
                    color: 'text.secondary',
                    lineHeight: 1.5,
                    mb: 1.5,
                  }}
                >
                  {translateGSPaperDesc(paper.code) || paper.shortDesc}
                </Typography>
              </Box>

              {/* Status Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  pt: 1.25,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  color: isSelected ? paper.color : 'text.disabled',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {isSelected ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>{t('activeFilter')}</span>
                  </>
                ) : (
                  <span>{t('clickToFilter')}</span>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
