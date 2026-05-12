import { Skeleton, Stack } from '@mui/material';

export const LoadingSkeleton = ({ height = 400 }: { height?: number }) => (
  <Stack spacing={2}>
    <Skeleton variant="rectangular" height={height} />
  </Stack>
);
