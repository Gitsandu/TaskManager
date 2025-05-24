'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import theme from '@/theme/theme';

export default function Providers({ children }: { children: ReactNode }) {
  // This effect runs only on the client and helps with hydration mismatches
  useEffect(() => {
    // Suppress React hydration warnings
    // This is useful when third-party scripts or browser extensions
    // modify the DOM before React hydration
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' && 
        (args[0].includes('Warning: Text content did not match') ||
         args[0].includes('Warning: Prop `%s` did not match') ||
         args[0].includes('Warning: Expected server HTML to contain a matching'))
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
