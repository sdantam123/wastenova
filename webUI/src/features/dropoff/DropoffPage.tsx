import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Box, Container, Typography, TextField, Button,
  Chip, Divider, Alert, InputAdornment, IconButton, Badge,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Paper, Tooltip,
  useMediaQuery, useTheme,
} from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NearMeIcon from '@mui/icons-material/NearMe';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useGetDropoffCentersQuery } from '../../api/recycleApi';
import { DropoffMap } from '../../components/maps/DropoffMap';
import type { DropoffCenter } from '../../types/recycling';
import { useAppSelector } from '../../store/store';
import { getDirectionsUrl } from '../../utils/directionsUrl';

const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

const materialLabel: Record<string, string> = {
  PLASTIC: 'Plastic', GLASS: 'Glass', METAL: 'Metal', PAPER: 'Paper',
  CARDBOARD: 'Cardboard', ELECTRONICS: 'E-Waste', BATTERIES: 'Batteries',
  PAINT: 'Paint', MEDICATIONS: 'Medications', MOTOR_OIL: 'Motor Oil',
  TEXTILES: 'Textiles', ORGANIC: 'Compost/Organic', SHARPS: 'Sharps',
  CLOTHING: 'Clothing', FOOD_WASTE: 'Food Waste',
  HOUSEHOLD_HAZARDOUS_WASTE: 'Household Hazardous Waste',
  BOOKS: 'Books', MEDICAL_EQUIPMENT: 'Medical Equipment',
};

const materialAliases: Record<string, string[]> = {
  ELECTRONICS: ['ELECTRONICS', 'E_WASTE'],
  BATTERIES: ['BATTERIES'],
  CLOTHING: ['CLOTHING', 'TEXTILES'],
  FOOD_WASTE: ['FOOD_WASTE', 'ORGANIC', 'COMPOST'],
  MOTOR_OIL: ['MOTOR_OIL'],
  HOUSEHOLD_HAZARDOUS_WASTE: ['HOUSEHOLD_HAZARDOUS_WASTE', 'HAZARDOUS', 'PAINT'],
  BOOKS: ['BOOKS', 'PAPER'],
  MEDICAL_EQUIPMENT: ['MEDICAL_EQUIPMENT', 'MEDICATIONS', 'SHARPS'],
};

const toolMaterials = [
  'ELECTRONICS',
  'BATTERIES',
  'CLOTHING',
  'FOOD_WASTE',
  'MOTOR_OIL',
  'HOUSEHOLD_HAZARDOUS_WASTE',
  'BOOKS',
  'MEDICAL_EQUIPMENT',
];

export function DropoffPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? '',
    id: 'recycle-compass-map',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const [search, setSearch] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const sharedPostalCode = useAppSelector((state) => state.location.postalCode);
  const activeJurisdictionId = useAppSelector((state) => state.location.active?.id);
  const [locationQuery, setLocationQuery] = useState(sharedPostalCode ?? '');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const hasLocation = Boolean(userCoords);
  const centersQueryArg = userCoords
    ? { lat: userCoords.lat, lng: userCoords.lng, radius: 50 as const, jurisdictionId: activeJurisdictionId }
    : skipToken;
  const { data: centersData = [], isFetching, isError } = useGetDropoffCentersQuery(centersQueryArg);
  const allMaterials = Array.from(new Set([...toolMaterials, ...centersData.flatMap((center) => center.acceptedMaterials)])).sort();

  useEffect(() => {
    if (sharedPostalCode) {
      setLocationQuery(sharedPostalCode);
    }
  }, [sharedPostalCode]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location services are not available in this browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSelectedId(null);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError('We could not access your location. Try searching by city or postal code instead.');
      },
    );
  };

  const searchLocation = () => {
    const query = locationQuery.trim();
    if (!query) {
      setLocationError('Enter a city, address, or postal code to search globally.');
      return;
    }

    if (mapsLoadError || !apiKey) {
      setLocationError('Map geocoding is not available right now. Try using your current location instead.');
      return;
    }

    if (!mapsLoaded || typeof window === 'undefined' || !window.google?.maps?.Geocoder) {
      setLocationError('Map is still loading, please try again in a moment.');
      return;
    }

    setLocationError('');
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: query }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const { lat, lng } = results[0].geometry.location;
        setUserCoords({ lat: lat(), lng: lng() });
        setSelectedId(null);
      } else {
        setLocationError('We could not find that place. Try a broader city or postal code.');
      }
    });
  };

  const toggleMaterial = (m: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
  };

  const filtered = centersData.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchesMaterials =
      selectedMaterials.length === 0 ||
      selectedMaterials.every((m) => {
        const aliases = materialAliases[m] ?? [m];
        return aliases.some((alias) => c.acceptedMaterials.includes(alias as any));
      });
    return matchesSearch && matchesMaterials;
  });

  const selectedCenter = filtered.find((c) => c.id === selectedId);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3);

  const todayHours = (center: DropoffCenter) =>
    center.hours?.[today as keyof typeof center.hours] ?? 'See website';

  const isOpen = (center: DropoffCenter) => {
    const h = todayHours(center);
    return h !== 'Closed' && h !== 'See website';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Top bar */}
      <Box sx={{ bgcolor: 'background.paper', color: 'text.primary', py: 2, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl" disableGutters>
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <LocationOnIcon />
            <Typography variant="h6" fontWeight={700}>Drop-off Finder</Typography>
          </Box>
          <Box display="flex" gap={1} flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search by facility name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 220, flexGrow: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
              }}
            />
            <TextField
              size="small"
              placeholder="City, postal code, or country"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchLocation()}
              sx={{ bgcolor: 'background.paper', borderRadius: 2, minWidth: 220, flexGrow: 1 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LocationOnIcon fontSize="small" /></InputAdornment>,
              }}
            />
            <Button variant="contained" size="small" onClick={searchLocation} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }}>
              Search place
            </Button>
            <Tooltip title="Use my location">
              <IconButton
                onClick={detectLocation}
                disabled={locating}
                sx={{ bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider' }}
              >
                <NearMeIcon />
              </IconButton>
            </Tooltip>
            <Badge badgeContent={selectedMaterials.length || null} color="warning">
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setShowFilters((v) => !v)}
                sx={{ bgcolor: 'background.paper', color: 'text.primary', borderColor: 'divider' }}
                size="small"
              >
                Filter
              </Button>
            </Badge>
            {isMobile && (
              <Button
                variant="outlined"
                size="small"
                sx={{ bgcolor: 'background.paper', color: 'text.primary', borderColor: 'divider' }}
                onClick={() => setMobileView((v) => (v === 'list' ? 'map' : 'list'))}
              >
                {mobileView === 'list' ? 'Show Map' : 'Show List'}
              </Button>
            )}
          </Box>

          {locationError && (
            <Alert severity="info" sx={{ mt: 1.5, width: '100%' }}>{locationError}</Alert>
          )}

          {/* Filters */}
          {showFilters && (
            <Box mt={1.5} display="flex" flexWrap="wrap" gap={0.8}>
              {allMaterials.map((m) => (
                <Chip
                  key={m}
                  label={materialLabel[m] ?? m.replaceAll('_', ' ')}
                  size="small"
                  onClick={() => toggleMaterial(m)}
                  variant={selectedMaterials.includes(m) ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: selectedMaterials.includes(m) ? 'background.paper' : 'transparent',
                    color: 'text.primary',
                    borderColor: 'divider',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

      {/* Main content: split view */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Category sidebar */}
        {!isMobile && (
          <Box
            sx={{
              width: 220,
              flexShrink: 0,
              overflowY: 'auto',
              bgcolor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, pt: 2, pb: 1, display: 'block' }}>
              Categories
            </Typography>
            <List disablePadding dense>
              {toolMaterials.map((m) => (
                <ListItem key={m} disablePadding>
                  <ListItemButton onClick={() => toggleMaterial(m)} sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Checkbox
                        edge="start"
                        checked={selectedMaterials.includes(m)}
                        tabIndex={-1}
                        disableRipple
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={materialLabel[m] ?? m.replaceAll('_', ' ')}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            {selectedMaterials.length > 0 && (
              <Button size="small" onClick={() => setSelectedMaterials([])} sx={{ ml: 1, mt: 0.5 }}>
                Clear filters
              </Button>
            )}
          </Box>
        )}

        {/* List panel */}
        {(!isMobile || mobileView === 'list') && (
          <Box
            sx={{
              width: { xs: '100%', md: 360 },
              flexShrink: 0,
              overflowY: 'auto',
              bgcolor: 'background.default',
              borderRight: { md: '1px solid' },
              borderColor: { md: 'divider' },
            }}
          >
            <Box sx={{ p: 1.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {!hasLocation && 'Set a location to load centers. '}
                {hasLocation && isFetching && 'Loading centers... '}
                {isError && 'Could not load live centers. '}
                {filtered.length} location{filtered.length !== 1 ? 's' : ''} found
                {selectedMaterials.length > 0 && ` · filtering by ${selectedMaterials.length} material(s)`}
              </Typography>
            </Box>

            {hasLocation && filtered.length === 0 && (
              <Box p={2}>
                <Alert severity="info">No centers match your filters. Try broadening your search.</Alert>
              </Box>
            )}

            {!hasLocation && (
              <Box p={2}>
                <Alert severity="info">Enter a city/postal code or use your current location to view nearby drop-off centers.</Alert>
              </Box>
            )}

            <List disablePadding>
              {filtered.map((center) => (
                <ListItem
                  key={center.id}
                  disablePadding
                  divider
                  sx={{ bgcolor: selectedId === center.id ? 'primary.light' : 'transparent' }}
                >
                  <ListItemButton
                    onClick={() => setSelectedId(center.id)}
                    sx={{ p: 2, alignItems: 'flex-start' }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ pr: 1 }}>
                          {center.name}
                        </Typography>
                        <Chip
                          label={isOpen(center) ? 'Open' : 'Closed'}
                          size="small"
                          color={isOpen(center) ? 'success' : 'default'}
                          sx={{ fontWeight: 700, flexShrink: 0 }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.75} mb={0.5} flexWrap="wrap">
                        <LocationOnIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary">{center.address}</Typography>
                        <Chip
                          component="a"
                          href={getDirectionsUrl({ lat: center.lat, lng: center.lng, address: center.address })}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          clickable
                          icon={<DirectionsIcon />}
                          label="Directions"
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <AccessTimeIcon fontSize="small" color="action" sx={{ flexShrink: 0 }} />
                        <Typography variant="caption" color="text.secondary">
                          Today: {todayHours(center)}
                        </Typography>
                      </Box>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {center.acceptedMaterials.slice(0, 4).map((m) => (
                          <Chip
                            key={m} label={materialLabel[m] ?? m.replaceAll('_', ' ')} size="small"
                            variant="outlined" color="primary"
                            sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        ))}
                        {center.acceptedMaterials.length > 4 && (
                          <Chip
                            label={`+${center.acceptedMaterials.length - 4}`} size="small"
                            variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Map panel */}
        {(!isMobile || mobileView === 'map') && (
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            {hasLocation ? (
              <DropoffMap
                centers={filtered}
                userCoords={userCoords}
                onCenterSelect={setSelectedId}
                selectedId={selectedId}
                isLoaded={mapsLoaded}
                loadError={mapsLoadError}
              />
            ) : (
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.default' }}>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', maxWidth: 460 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Set your location to start
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use Search place or Use my location above to load nearby drop-off centers and map pins.
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Selected center detail overlay */}
            {selectedCenter && (
              <Paper
                elevation={4}
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: { xs: '92%', sm: 420 },
                  borderRadius: 3,
                  p: 2,
                  zIndex: 10,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="subtitle1" fontWeight={700}>{selectedCenter.name}</Typography>
                  <Chip
                    label={isOpen(selectedCenter) ? 'Open Now' : 'Closed'}
                    size="small"
                    color={isOpen(selectedCenter) ? 'success' : 'default'}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2">{selectedCenter.address}</Typography>
                </Box>
                {selectedCenter.phone && (
                  <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{selectedCenter.phone}</Typography>
                  </Box>
                )}
                {selectedCenter.notes && (
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    {selectedCenter.notes}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                  Accepted materials
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.5}>
                  {selectedCenter.acceptedMaterials.map((m) => (
                    <Chip key={m} label={materialLabel[m] ?? m.replaceAll('_', ' ')} size="small" color="primary" variant="outlined" />
                  ))}
                </Box>
                <Button
                  size="small" variant="contained" startIcon={<DirectionsIcon />}
                  href={getDirectionsUrl({ lat: selectedCenter.lat, lng: selectedCenter.lng, address: selectedCenter.address })}
                  target="_blank" rel="noopener noreferrer"
                >
                  Get Directions
                </Button>
                <Button
                  size="small" sx={{ ml: 1 }}
                  onClick={() => setSelectedId(null)}
                >
                  Close
                </Button>
              </Paper>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
