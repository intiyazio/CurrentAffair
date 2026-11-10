import React from 'react';
import {
  Box,
  Typography,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Flag,
  Globe2,
  Landmark,
  TrendingUp,
  Leaf,
  Atom,
  Shield,
  FileCheck,
  Users,
  FileSpreadsheet,
  Map,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { UPSC_CATEGORIES } from '../utils/filterUtils';
import type { CurrentAffair } from '../types/news';
import { useLanguage } from '../context/LanguageContext';

interface CategoryFiltersProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  articles: CurrentAffair[];
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  articles,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t, translateCategory } = useLanguage();

  // Compute category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of UPSC_CATEGORIES) {
      counts[cat] = 0;
    }
    for (const art of articles) {
      if (counts[art.category] !== undefined) {
        counts[art.category]++;
      }
    }
    return counts;
  }, [articles]);

  const categoryIcons: Record<string, React.ReactElement> = {
    'National Affairs': <Flag size={15} />,
    'International Relations': <Globe2 size={15} />,
    'Indian Polity': <Landmark size={15} />,
    Economy: <TrendingUp size={15} />,
    'Environment & Ecology': <Leaf size={15} />,
    'Science & Technology': <Atom size={15} />,
    'Defence & Security': <Shield size={15} />,
    'Government Schemes': <FileCheck size={15} />,
    'Social Issues': <Users size={15} />,
    'Important Reports & Indices': <FileSpreadsheet size={15} />,
    Geography: <Map size={15} />,
    'History & Culture': <BookOpen size={15} />,
  };

  return (
    <Box id="categories" sx={{ py: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            {t('categoriesTitle')}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('categoriesSubtitle')}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.25,
          alignItems: 'center',
        }}
      >
        {/* All Categories Option */}
        <Chip
          icon={<LayoutGrid size={15} />}
          label={`${t('allCategories')} (${articles.length})`}
          clickable
          onClick={() => onSelectCategory('All')}
          sx={{
            px: 1,
            py: 2.2,
            borderRadius: 2.5,
            fontWeight: selectedCategory === 'All' ? 700 : 500,
            fontSize: '0.84rem',
            backgroundColor:
              selectedCategory === 'All'
                ? '#01484a'
                : isLight
                ? '#ffffff'
                : 'rgba(255, 255, 255, 0.05)',
            color: selectedCategory === 'All' ? '#ffffff' : 'text.primary',
            border: `1px solid ${
              selectedCategory === 'All' ? '#01484a' : theme.palette.divider
            }`,
            '& .MuiChip-icon': {
              color: selectedCategory === 'All' ? '#ffffff' : '#01484a',
            },
            '&:hover': {
              backgroundColor: selectedCategory === 'All' ? '#01484a' : 'rgba(1, 72, 74, 0.08)',
            },
          }}
        />

        {/* 12 Clickable Categories */}
        {UPSC_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <Chip
              key={cat}
              icon={categoryIcons[cat]}
              label={`${translateCategory(cat)} (${count})`}
              clickable
              onClick={() => onSelectCategory(isSelected ? 'All' : cat)}
              sx={{
                px: 1,
                py: 2.2,
                borderRadius: 2.5,
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.84rem',
                backgroundColor: isSelected
                  ? '#01484a'
                  : isLight
                  ? '#ffffff'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#ffffff' : 'text.primary',
                border: `1px solid ${isSelected ? '#01484a' : theme.palette.divider}`,
                '& .MuiChip-icon': {
                  color: isSelected ? '#ffffff' : '#01484a',
                },
                '&:hover': {
                  backgroundColor: isSelected ? '#01484a' : 'rgba(1, 72, 74, 0.08)',
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};
