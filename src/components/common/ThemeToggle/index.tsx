import React from 'react';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

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
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[4],
          borderRadius: '50%',
          width: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          zIndex: theme.zIndex.drawer + 1,
          '&:hover': {
            bgcolor: 'background.paper',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <LightModeIcon
              sx={{
                color: 'primary.main',
                fontSize: { xs: 24, sm: 28 },
              }}
            />
          ) : (
            <DarkModeIcon
              sx={{
                color: 'primary.main',
                fontSize: { xs: 24, sm: 28 },
              }}
            />
          )}
        </motion.div>
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 