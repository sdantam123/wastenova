import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { CategoryBrowser } from './CategoryBrowser';
import { categoryNavItems } from './categoryNav';

export function ProgramsPage() {
  const [searchParams] = useSearchParams();
  const activeCategory = categoryNavItems.find((item) => item.key === searchParams.get('category'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
          <RecyclingIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700}>{activeCategory ? activeCategory.label : 'Recycling Programs'}</Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          {activeCategory
            ? activeCategory.isLocationInfo
              ? 'Details about your current ZIP code and jurisdiction.'
              : `Drop-off locations and mail-in or take-back programs for ${activeCategory.label.toLowerCase()}.`
            : "Mail-in, retail take-back, municipal, and local drop-off programs for items that don't go in curbside recycling — batteries, electronics, textiles, medications, and more."}
        </Typography>
      </Box>

      <CategoryBrowser />
    </Container>
  );
}
