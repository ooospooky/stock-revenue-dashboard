'use client';
import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderRadius: 0.375,
      px: 2,
      py: 1.25,
      fontSize: '0.875rem',
      fontWeight: 'fontWeightMedium',
      lineHeight: 1,
      userSelect: 'none',
    }}
  >
    {children}
  </Box>
);
