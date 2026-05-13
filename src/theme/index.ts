'use client';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    revenue: { main: string };
    yoy: { positive: string; negative: string };
    tableStripe: { main: string };
  }
  interface PaletteOptions {
    revenue?: { main: string };
    yoy?: { positive: string; negative: string };
    tableStripe?: { main: string };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    revenue: { main: '#F4B400' },
    yoy: { positive: '#2E7D32', negative: '#C62828' },
    tableStripe: { main: '#EAF2FB' },
    background: { default: '#F5F6F8', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8 },
});
