import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '../theme';
// import { useTaskStore } from '../store/taskStore';

function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={createAppTheme('light')}>
        {children}
      </ThemeProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 