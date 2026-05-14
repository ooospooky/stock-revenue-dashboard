import { Alert, Box, Link, Paper, Stack, Typography } from '@mui/material';

const NotFoundPage = () => (
  <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 720, mx: 'auto' }}>
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2}>
        <Typography variant="h2">找不到此頁面</Typography>
        <Alert severity="info">您要找的頁面不存在或已被移除。</Alert>
        <Link href="/" underline="hover">
          回到首頁
        </Link>
      </Stack>
    </Paper>
  </Box>
);

export default NotFoundPage;
