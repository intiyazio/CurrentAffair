import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Link,
  useTheme,
} from '@mui/material';
import {
  GraduationCap,
  ShieldCheck,
  Clock,
  ExternalLink,
  Code2,
} from 'lucide-react';
import type { SourceSummary } from '../types/news';
import { formatArticleDate } from '../utils/dateUtils';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  lastUpdated: string | null;
  sources: SourceSummary[];
}

export const Footer: React.FC<FooterProps> = ({ lastUpdated, sources }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const { t, translateSource } = useLanguage();

  const activeSourcesCount = sources.filter((s) => s.status === 'active').length;

  return (
    <Box
      id="about"
      component="footer"
      sx={{
        backgroundColor: isLight ? '#032021' : '#060d0d',
        color: '#f8fafc',
        pt: 7,
        pb: 5,
        mt: 8,
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 5 }}>
          {/* Col 1: Brand & Objective */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#01484a',
                }}
              >
                <GraduationCap size={22} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                {t('brandName')}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: '#94a3b8', lineHeight: 1.7, mb: 2.5, pr: { md: 3 } }}
            >
              {t('footerAboutDesc')}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2dd4bf' }}>
              <Clock size={16} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {t('footerDataUpdated')} {lastUpdated ? formatArticleDate(lastUpdated) : 'Live'}
                {activeSourcesCount > 0 && ` • (${activeSourcesCount} ${t('footerActiveFeeds')})`}
              </Typography>
            </Box>
          </Grid>

          {/* Col 2: Primary Data Sources */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              {t('footerMonitoredSources')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { name: 'Press Information Bureau (PIB)', url: 'https://pib.gov.in/' },
                { name: 'Reserve Bank of India (RBI)', url: 'https://www.rbi.org.in/' },
                { name: 'PRS Legislative Research', url: 'https://prsindia.org/' },
                { name: 'The Hindu (National, Economy, SciTech)', url: 'https://www.thehindu.com/' },
                { name: 'Indian Express (Explained & India)', url: 'https://indianexpress.com/' },
                { name: 'Livemint (Policy & Economy)', url: 'https://www.livemint.com/' },
              ].map((src) => (
                <Link
                  key={src.name}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: '#cbd5e1',
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.6,
                    '&:hover': { color: '#2dd4bf' },
                  }}
                >
                  <ExternalLink size={12} />
                  <span>{translateSource(src.name)}</span>
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Col 3: Architecture & Deployment */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              {t('footerArchitectureTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6, mb: 2 }}>
              {t('footerArchitectureDesc')}
            </Typography>

            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                },
              }}
            >
              <Code2 size={16} />
              <span>{t('footerGithubRepo')}</span>
            </Link>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }} />

        {/* Disclaimer Section */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2.5,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f59e0b', mb: 0.75 }}>
            <ShieldCheck size={16} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('footerDisclaimerTitle')}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ display: 'block', color: '#94a3b8', lineHeight: 1.65 }}>
            {t('footerDisclaimerText')}
          </Typography>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
            color: '#64748b',
            fontSize: '0.78rem',
          }}
        >
          <Typography variant="caption">
            © {new Date().getFullYear()} {t('footerCopyright')}
          </Typography>
          <Typography variant="caption">
            {t('footerProduction')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
