import { createTheme, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#6B8AFF' : '#3f51b5',
      light: mode === 'dark' ? '#8AA2FF' : '#757de8',
      dark: mode === 'dark' ? '#4D6EE6' : '#002984',
    },
    secondary: {
      main: mode === 'dark' ? '#FF4081' : '#f50057',
      light: mode === 'dark' ? '#FF6B9D' : '#ff4081',
      dark: mode === 'dark' ? '#E61B64' : '#c51162',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1E1E1E' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#000000',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'dark' 
            ? 'rgba(30, 30, 30, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          boxShadow: mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const createAppTheme = (mode: PaletteMode): Theme => {
  return createTheme(getDesignTokens(mode));
}; 