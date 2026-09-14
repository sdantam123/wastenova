import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingOverlayProps {
  loading: boolean;
  minHeight?: string | number;
}

export function LoadingOverlay({ loading, minHeight = 200 }: LoadingOverlayProps) {
  if (!loading) return null;
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={minHeight}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}
