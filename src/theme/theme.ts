import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

export const PRIMARY_COLOR = '#01484a';
export const PRIMARY_LIGHT = '#0f6b6e';
export const PRIMARY_DARK = '#003133';
export const ACCENT_GOLD = '#d97706';
export const ACCENT_EMERALD = '#059669';

export function getAppTheme(mode: 'light' | 'dark') {
  const isLight = mode === 'light';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: PRIMARY_COLOR,
        light: PRIMARY_LIGHT,
        dark: PRIMARY_DARK,
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0e756c',
        light: '#14b8a6',
        dark: '#0f524c',
        contrastText: '#ffffff',
      },
      background: {
        default: isLight ? '#f8fafc' : '#091313',
        paper: isLight ? '#ffffff' : '#0e1d1d',
      },
      text: {
        primary: isLight ? '#0f172a' : '#f1f5f9',
        secondary: isLight ? '#475569' : '#94a3b8',
      },
      divider: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'sans-serif',
      ].join(','),
      h1: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 600,
      },
      h6: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontWeight: 600,
      },
      body1: {
        fontSize: '0.985rem',
        lineHeight: 1.65,
        letterSpacing: '-0.005em',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.55,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            borderColor: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
}
