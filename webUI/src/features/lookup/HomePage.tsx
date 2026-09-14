import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ZipLookupForm } from '../../components/location/ZipLookupForm';
import { useAppSelector } from '../../store/store';
import { categoryNavItems } from '../programs/categoryNav';

const previewCategories = categoryNavItems.filter((item) => !item.isLocationInfo).slice(0, 8);

export function HomePage() {
  const navigate = useNavigate();
  const active = useAppSelector((s) => s.location.active);
  const savedZip = useAppSelector((s) => s.location.postalCode);

  const hasResolvedZip = Boolean(active && savedZip);

  // Once a ZIP is resolved, the site's single "home" experience is the Home
  // category page (sidebar-driven, correctly highlights "Home"). This page
  // only exists to onboard a visitor who hasn't set a ZIP yet.
  if (hasResolvedZip) {
    return <Navigate to="/programs?category=home" replace />;
  }

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          color: 'text.primary',
          py: { xs: 8, md: 12 },
          background: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.02), transparent 45%)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip icon={<AutoAwesomeIcon />} label="Smarter recycling for every home and city" sx={{ bgcolor: 'background.paper', color: 'text.primary', mb: 2, border: '1px solid', borderColor: 'divider' }} />
              <Typography variant="h3" sx={{ mb: 1.5 }}>
                Start with your ZIP code.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, color: 'text.secondary', mb: 3, maxWidth: 680 }}>
                WasteNova checks your ZIP and shows exactly where to take tires, paint, electronics, medications, and more — with maps, current hours, and upcoming collection events for your area.
              </Typography>
              <ZipLookupForm onResolved={() => navigate('/programs?category=home')} />
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {previewCategories.map((item) => (
                  <Chip
                    key={item.key}
                    label={item.label}
                    size="small"
                    sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', color: 'text.primary' }}
                  />
                ))}
                <Chip label={`+${categoryNavItems.length - 1 - previewCategories.length} more`} size="small" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'success.light', color: 'success.dark' }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  What your ZIP unlocks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                  {[
                    'Your curbside pickup calendar and recycling rules',
                    'Drop-off locations by category, each with a map and hours',
                    'Locations in your exact ZIP are highlighted first',
                    'Upcoming one-day collection events near you, soonest first',
                    'Your ZIP is remembered across the site after lookup',
                  ].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary' }}>
                      <InfoOutlinedIcon fontSize="small" color="action" />
                      <Typography variant="body2">{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Next step
          </Typography>
          <Typography variant="body2" color="text.secondary">
            After you check your ZIP, you'll land on your Home page with every category in the left sidebar — pick one to see drop-off locations, hours, and events near you.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
