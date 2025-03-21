import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

// Import your store provider if you're using Zustand
import { TodoProvider } from '../store/TodoStore';

function render(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <ThemeProvider theme={theme}>
        <TodoProvider>{children}</TodoProvider>
      </ThemeProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render }; 