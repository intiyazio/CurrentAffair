import React from 'react';
import {
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Search, X as ClearIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search news, schemes, landmark cases, keywords...',
  fullWidth = true,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0.5,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 2.5,
        border: `1.5px solid ${
          isLight ? 'rgba(1, 72, 74, 0.2)' : 'rgba(45, 212, 191, 0.3)'
        }`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: isLight
          ? '0 4px 12px rgba(1, 72, 74, 0.05)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <TextField
        fullWidth={fullWidth}
        variant="standard"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        slotProps={{
          input: {
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start" sx={{ pl: 1.5, pr: 1, color: '#01484a' }}>
                <Search size={20} />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end" sx={{ pr: 1 }}>
                <IconButton size="small" onClick={() => onChange('')} aria-label="Clear search">
                  <ClearIcon size={16} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { fontSize: '0.95rem', py: 0.5 },
          },
        }}
      />
    </Paper>
  );
};
