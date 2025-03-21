import React from 'react';
import { CssBaseline, Container, Typography, Box, ThemeProvider, useMediaQuery } from '@mui/material';
import { AppErrorBoundary } from './components/common/ErrorBoundary';
import TaskForm from './components/tasks/TaskForm';
import TaskList from './components/tasks/TaskList';
import { theme } from './theme';
import { useTaskStore } from './store/taskStore';
import { motion } from 'framer-motion';

function App() {
  const { addTask } = useTaskStore();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          minWidth: '100vw',
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          py: { xs: 3, sm: 4, md: 5 },
          px: { xs: 2, sm: 3 },
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <AppErrorBoundary>
          <Container 
            maxWidth="md"
            sx={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mb: { xs: 3, sm: 4, md: 5 },
                  px: { xs: 2, sm: 0 },
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    letterSpacing: '-0.5px',
                    mb: { xs: 1, sm: 2 }
                  }}
                >
                  Todo App
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.5
                  }}
                >
                  Manage your tasks efficiently with our beautiful and intuitive interface
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'background.paper', 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: {
                    xs: '0 4px 16px rgba(0,0,0,0.1)',
                    sm: '0 8px 32px rgba(0,0,0,0.1)'
                  },
                  mb: { xs: 2, sm: 3, md: 4 },
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                    mb: { xs: 2, sm: 3 }
                  }}
                >
                  Add New Task
                </Typography>
                <TaskForm onSubmit={addTask} />
              </Box>

              <Box 
                sx={{ 
                  bgcolor: 'background.paper', 
                  p: { xs: 2, sm: 3, md: 4 }, 
                  borderRadius: { xs: 2, sm: 3 },
                  boxShadow: {
                    xs: '0 4px 16px rgba(0,0,0,0.1)',
                    sm: '0 8px 32px rgba(0,0,0,0.1)'
                  },
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <TaskList />
              </Box>
            </motion.div>
          </Container>
        </AppErrorBoundary>
      </Box>
    </ThemeProvider>
  );
}

export default App; 