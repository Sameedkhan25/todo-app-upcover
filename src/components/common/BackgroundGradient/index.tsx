import React from 'react';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

const BackgroundGradient: React.FC = () => {
  const theme = useTheme();

  // Define gradient colors based on theme mode
  const gradientColors = {
    light: {
      primary: alpha(theme.palette.primary.light, 0.2),
      secondary: alpha(theme.palette.secondary.light, 0.15),
      accent1: alpha(theme.palette.info.light, 0.1),
      accent2: alpha(theme.palette.success.light, 0.05),
    },
    dark: {
      primary: alpha(theme.palette.primary.dark, 0.3),
      secondary: alpha(theme.palette.secondary.dark, 0.25),
      accent1: alpha(theme.palette.info.dark, 0.2),
      accent2: alpha(theme.palette.success.dark, 0.15),
    },
  };

  const colors = theme.palette.mode === 'dark' ? gradientColors.dark : gradientColors.light;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: theme.palette.background.default,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle at center, 
            ${colors.primary} 0%, 
            ${colors.secondary} 25%, 
            ${colors.accent1} 50%,
            ${colors.accent2} 75%,
            transparent 100%)`,
          filter: 'blur(60px)',
          opacity: 0.8,
          animation: 'pulse 15s ease-in-out infinite alternate',
        },
        '&::before': {
          top: '-25%',
          left: '-25%',
          transform: 'rotate(-15deg)',
        },
        '&::after': {
          bottom: '-25%',
          right: '-25%',
          transform: 'rotate(15deg) scale(1, -1)', // Mirror effect
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'rotate(-15deg) scale(1)',
          },
          '50%': {
            transform: 'rotate(-5deg) scale(1.1)',
          },
          '100%': {
            transform: 'rotate(-15deg) scale(1)',
          },
        },
      }}
    />
  );
};

export default BackgroundGradient; 