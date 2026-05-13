'use client';
import { createTheme } from '@mui/material/styles';

type RevenuePalette = {
  main: string;
  fill: string;
};

declare module '@mui/material/styles' {
  interface Palette {
    revenue: RevenuePalette;
    yoy: { positive: string; negative: string };
    tableStripe: { main: string };
  }
  interface PaletteOptions {
    revenue?: RevenuePalette;
    yoy?: { positive: string; negative: string };
    tableStripe?: { main: string };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    revenue: {
      main: '#E8AF00',
      fill: '#F6DF99',
    },
    yoy: { positive: '#2E7D32', negative: '#C62828' },
    tableStripe: { main: '#EAF2FB' },
    background: { default: '#F5F6F8', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8 },
});
