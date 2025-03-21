import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
import type { FallbackProps } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 3,
      textAlign: 'center',
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom color="error">
      Oops! Something went wrong.
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      {error.message || 'An unexpected error occurred.'}
    </Typography>
    <Button
      variant="contained"
      onClick={() => {
        resetErrorBoundary();
        window.location.reload();
      }}
    >
      Refresh Page
    </Button>
  </Box>
);

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ReactErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={() => {
      // Optional: Add any cleanup or state reset logic here
    }}
  >
    {children}
  </ReactErrorBoundary>
);

export default AppErrorBoundary; 