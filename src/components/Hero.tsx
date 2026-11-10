import React from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import {
  Search,
  X as ClearIcon,
  Calendar,
  Clock,
  Database,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { formatTodayHeadline, formatRelativeTime, formatArticleDate } from '../utils/dateUtils';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lastUpdated: string | null;
  totalArticles: number;
  isStale: boolean;
  onQuickCategoryClick?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  lastUpdated,
  totalArticles,
  isStale,
  onQuickCategoryClick,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const todayStr = formatTodayHeadline();
  const updatedRelative = lastUpdated ? formatRelativeTime(lastUpdated) : 'Fetching...';
  const updatedExact = lastUpdated ? formatArticleDate(lastUpdated) : '';

  const quickPills = [
    'Economy',
    'Indian Polity',
    'Environment & Ecology',
    'Science & Technology',
    'International Relations',
  ];

  return (
    <Box
      id="home"
      sx={{
        pt: { xs: 5, md: 8 },
        pb: { xs: 5, md: 7 },
        background: isLight
          ? 'linear-gradient(180deg, rgba(1, 72, 74, 0.05) 0%, rgba(248, 250, 252, 1) 100%)'
          : 'linear-gradient(180deg, rgba(1, 72, 74, 0.25) 0%, rgba(9, 19, 19, 1) 100%)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        {/* Stale Data Warning Banner if GitHub Action was delayed */}
        {isStale && (
          <Alert
            severity="warning"
            icon={<AlertTriangle size={20} />}
            sx={{ mb: 4, borderRadius: 2 }}
          >
            <strong>Note on Data Freshness:</strong> The current affairs data was last updated over
            24 hours ago ({updatedExact}). The next automated GitHub Actions cycle will refresh the feed
            shortly.
          </Alert>
        )}

        <Box sx={{ maxWidth: 840, mx: 'auto', textAlign: 'center' }}>
          {/* Today's Date & Live Status Pill */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 0.8,
              borderRadius: '999px',
              backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.06)',
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#01484a' }}>
              <Calendar size={15} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {todayStr}
              </Typography>
            </Box>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'text.disabled' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Clock size={14} color="#059669" />
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Updated {updatedRelative}
              </Typography>
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2.1rem', sm: '2.8rem', md: '3.4rem' },
              fontWeight: 800,
              lineHeight: 1.15,
              mb: 2,
              color: isLight ? '#01484a' : '#2dd4bf',
            }}
          >
            Stay Updated. Stay Ahead.
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              lineHeight: 1.6,
              mb: 4,
              maxWidth: 680,
              mx: 'auto',
            }}
          >
            Daily Indian current affairs curated from official government portals and trusted primary
            sources, mapped specifically to the UPSC Civil Services Examination.
          </Typography>

          {/* Search Box */}
          <Paper
            elevation={0}
            sx={{
              p: 0.75,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 3,
              border: `2px solid ${isLight ? 'rgba(1, 72, 74, 0.18)' : 'rgba(45, 212, 191, 0.3)'}`,
              boxShadow: isLight
                ? '0 10px 25px -5px rgba(1, 72, 74, 0.08), 0 8px 10px -6px rgba(1, 72, 74, 0.04)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
              backgroundColor: theme.palette.background.paper,
              mb: 2.5,
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search news, government schemes, keywords (e.g. RBI, Supreme Court, COP, GDP)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              slotProps={{
                input: {
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start" sx={{ pl: 1.5, pr: 1, color: '#01484a' }}>
                      <Search size={22} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end" sx={{ pr: 1 }}>
                      <IconButton size="small" onClick={() => onSearchChange('')} aria-label="Clear search">
                        <ClearIcon size={18} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  sx: { fontSize: { xs: '0.95rem', sm: '1.05rem' }, py: 0.75 },
                },
              }}
            />
          </Paper>

          {/* Quick Category Chips */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 4,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mr: 0.5 }}>
              Popular Topics:
            </Typography>
            {quickPills.map((pill) => (
              <Chip
                key={pill}
                label={pill}
                size="small"
                clickable
                onClick={() => onQuickCategoryClick && onQuickCategoryClick(pill)}
                sx={{
                  backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${theme.palette.divider}`,
                  fontWeight: 500,
                  fontSize: '0.78rem',
                  '&:hover': {
                    backgroundColor: isLight ? 'rgba(1, 72, 74, 0.08)' : 'rgba(45, 212, 191, 0.15)',
                    borderColor: '#01484a',
                  },
                }}
              />
            ))}
          </Box>

          {/* Quick Metrics & Integrity Badges */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              gap: 2,
              textAlign: 'left',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#01484a', mb: 0.5 }}>
                <Database size={17} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Total Articles
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {totalArticles > 0 ? `${totalArticles}+ Verified` : 'Loading...'}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#059669', mb: 0.5 }}>
                <CheckCircle2 size={17} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Primary Sources
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                PIB, RBI, PRS & More
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0284c7', mb: 0.5 }}>
                <Sparkles size={17} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Syllabus Mapping
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                GS I, II, III, IV & Essay
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#d97706', mb: 0.5 }}>
                <Clock size={17} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Updates
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Every 6 Hours
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
