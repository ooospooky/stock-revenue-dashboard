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
      borderRadius: 1,
      px: 1.5,
      py: 0.75,
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1,
      userSelect: 'none',
    }}
  >
    {children}
  </Box>
);
