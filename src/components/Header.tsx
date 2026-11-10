import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Compass,
  Bookmark,
  Sun,
  Moon,
  Menu as MenuIcon,
  X as CloseIcon,
  Newspaper,
  Layers,
  GraduationCap,
  Info,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
  bookmarkCount: number;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onToggleTheme,
  bookmarkCount,
  activeTab,
  onSelectTab,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { id: 'home', label: t('navHome'), icon: Compass },
    { id: 'today', label: t('navHighlights'), icon: Newspaper },
    { id: 'feed', label: t('navAllNews'), icon: Layers },
    { id: 'categories', label: t('navCategories'), icon: GraduationCap },
    { id: 'saved', label: t('navSaved'), icon: Bookmark, badge: bookmarkCount },
    { id: 'about', label: t('navAbout'), icon: Info },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    setMobileOpen(false);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(14, 29, 29, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 0.5 }}>
          {/* Logo & Branding */}
          <Box
            onClick={() => handleNavClick('home')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#01484a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(1, 72, 74, 0.3)',
              }}
            >
              <GraduationCap size={22} strokeWidth={2.2} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', sm: '1.2rem' },
                  letterSpacing: '-0.02em',
                  color: mode === 'light' ? '#01484a' : '#14b8a6',
                  lineHeight: 1.15,
                }}
              >
                {t('brandName')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.secondary',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                }}
              >
                {t('tagline')}
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    startIcon={
                      item.badge !== undefined && item.badge > 0 ? (
                        <Badge
                          badgeContent={item.badge}
                          color="primary"
                          sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', height: 16, minWidth: 16 } }}
                        >
                          <IconComponent size={16} />
                        </Badge>
                      ) : (
                        <IconComponent size={16} />
                      )
                    }
                    sx={{
                      px: 1.6,
                      py: 0.8,
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? '#01484a'
                        : mode === 'light'
                        ? 'text.primary'
                        : 'text.secondary',
                      backgroundColor: isActive
                        ? mode === 'light'
                          ? 'rgba(1, 72, 74, 0.08)'
                          : 'rgba(20, 184, 166, 0.15)'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: mode === 'light' ? 'rgba(1, 72, 74, 0.05)' : 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Action Icons (Language switcher + Theme toggle + Mobile menu button) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language Switcher Pill */}
            <Tooltip title={language === 'en' ? 'हिन्दी में बदलें (Switch to Hindi)' : 'Switch to English'}>
              <Button
                variant="outlined"
                size="small"
                onClick={toggleLanguage}
                startIcon={<Languages size={15} />}
                sx={{
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.6,
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  borderColor: theme.palette.divider,
                  color: mode === 'light' ? '#01484a' : '#2dd4bf',
                  backgroundColor: mode === 'light' ? 'rgba(1, 72, 74, 0.04)' : 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderColor: '#01484a',
                    backgroundColor: mode === 'light' ? 'rgba(1, 72, 74, 0.08)' : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </Button>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton
                onClick={onToggleTheme}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  p: 0.9,
                  color: mode === 'light' ? '#01484a' : '#f59e0b',
                }}
              >
                {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </IconButton>
            </Tooltip>

            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  p: 0.9,
                  color: 'text.primary',
                }}
                aria-label="Open navigation menu"
              >
                <MenuIcon size={20} />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.paper,
            p: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GraduationCap size={20} color="#01484a" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {t('navMenu')}
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon size={20} />
          </IconButton>
        </Box>

        {/* Mobile Language Switcher */}
        <Box sx={{ mb: 2, px: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={toggleLanguage}
            startIcon={<Languages size={16} />}
            sx={{
              py: 0.8,
              fontWeight: 700,
              borderRadius: 2,
              borderColor: '#01484a',
              color: '#01484a',
            }}
          >
            {language === 'en' ? 'हिन्दी में बदलें (Hindi)' : 'Switch to English'}
          </Button>
        </Box>

        <List>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.id)}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(1, 72, 74, 0.1)',
                      color: '#01484a',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: isActive ? '#01484a' : 'inherit' }}>
                    <IconComponent size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: '0.92rem', fontWeight: isActive ? 700 : 500 }}>
                        {item.label}
                      </Typography>
                    }
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge badgeContent={item.badge} color="primary" />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};
