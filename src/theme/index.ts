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
  interface TypographyVariants {
    fontWeightSemibold: number;
  }
  interface TypographyVariantsOptions {
    fontWeightSemibold?: number;
  }
  interface ShapeOptions {
    borderRadiusBadge?: number;
  }
  interface Shape {
    borderRadiusBadge: number;
  }
  interface BreakpointOverrides {
    pageMax: true;
  }
}

export const theme = createTheme({
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, pageMax: 1280 },
  },
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
    fontFamily: '"PingFang TC", var(--font-geist-sans), sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    h1: { fontSize: '1.5rem', fontWeight: 600 },
    h2: { fontSize: '1.25rem', fontWeight: 600 },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8, borderRadiusBadge: 3 },
});
