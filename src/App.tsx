import React from 'react';
import { CssBaseline, Container, Typography, Box, ThemeProvider, useMediaQuery } from '@mui/material';
import { AppErrorBoundary } from './components/common/ErrorBoundary';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import ThemeToggle from './components/common/ThemeToggle';
import BackgroundGradient from './components/common/BackgroundGradient';
import { useThemeStore } from './store/themeStore';
import { useTaskStore } from './store/taskStore';
import { createAppTheme } from './theme';
import { motion } from 'framer-motion';

function App() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { addTask } = useTaskStore();
  const theme = React.useMemo(() => createAppTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);
  // @ts-ignore - Will be used for future mobile responsiveness features
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BackgroundGradient />
      
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            pt: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 4, sm: 5 } }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  letterSpacing: '-0.5px',
                  mb: { xs: 2, sm: 3 },
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Taskify
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  maxWidth: '600px',
                  mx: 'auto',
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                Transform your productivity with task management
              </Typography>
            </Box>

            <Box sx={{ mb: { xs: 4, sm: 5 } }}>
              <TaskForm onSubmit={addTask} />
            </Box>

            <TaskList />
          </motion.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
} 