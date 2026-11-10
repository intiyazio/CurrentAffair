import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getAppTheme } from './theme/theme';
import { HomePage } from './pages/HomePage';
import { LanguageProvider } from './context/LanguageContext';

export function App() {
  // Default theme is strictly 'light' as requested
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('upsc_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light'; // Strict light mode default
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('upsc_theme_mode', mode);
    } catch {
      // Ignore localStorage issues
    }
  }, [mode]);

  const theme = useMemo(() => getAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HomePage mode={mode} onToggleTheme={toggleTheme} />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
