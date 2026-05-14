'use client';
import { useEffect } from 'react';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';

type ErrorPageProps = {
  error: Error & { digest?: string };
};

const ErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 720, mx: 'auto' }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h2">發生未預期的錯誤</Typography>
          <Alert severity="error">
            頁面渲染時出現問題，請重新整理頁面後再試。
          </Alert>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
