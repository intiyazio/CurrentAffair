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
} from 'lucide-react';

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

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'today', label: "Today's Highlights", icon: Newspaper },
    { id: 'feed', label: 'All News', icon: Layers },
    { id: 'categories', label: 'Categories', icon: GraduationCap },
    { id: 'saved', label: 'Saved Articles', icon: Bookmark, badge: bookmarkCount },
    { id: 'about', label: 'About & Sources', icon: Info },
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
                UPSC Current Affairs
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
                Understand Today. Prepare for Tomorrow.
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      px: 1.8,
                      py: 0.8,
                      borderRadius: '8px',
                      fontSize: '0.88rem',
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

          {/* Action Icons (Theme toggle + Mobile menu button) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
              <IconButton
                onClick={onToggleTheme}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  p: 1,
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
                  p: 1,
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
              Navigation
            </Typography>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon size={20} />
          </IconButton>
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
