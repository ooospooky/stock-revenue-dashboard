'use client';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';

export const SectionLabel = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: `${theme.shape.borderRadiusBadge}px`,
        px: 2,
        py: 1.25,
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {children}
    </Box>
  );
};
