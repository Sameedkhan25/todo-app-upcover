import React from 'react';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { alpha } from '@mui/material/styles';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  const theme = useTheme();
  
  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'fixed',
          right: { xs: 16, sm: 24, md: 32 },
          top: { xs: 16, sm: 24, md: 32 },
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
          border: '1px solid',
          borderColor: (theme) => alpha(theme.palette.divider, 0.1),
          borderRadius: '50%',
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: theme.zIndex.drawer + 1,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
            transform: 'scale(1.05) translateY(-2px)',
            boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
            '& .theme-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
          },
          '&:active': {
            transform: 'scale(0.95) translateY(0)',
            boxShadow: (theme) => `0 2px 10px ${alpha(theme.palette.common.black, 0.1)}`,
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 30 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 20
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            lineHeight: 0
          }}
        >
          {isDark ? (
            <LightModeIcon
              className="theme-icon"
              sx={{
                color: 'primary.main',
                fontSize: { xs: 22, sm: 26 },
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'block',
              }}
            />
          ) : (
            <DarkModeIcon
              className="theme-icon"
              sx={{
                color: 'primary.main',
                fontSize: { xs: 22, sm: 26 },
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'block',
              }}
            />
          )}
        </motion.div>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 