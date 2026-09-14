import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py={6}
      gap={2}
    >
      {icon && <Box sx={{ fontSize: 64, color: 'text.secondary' }}>{icon}</Box>}
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" maxWidth={360}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
