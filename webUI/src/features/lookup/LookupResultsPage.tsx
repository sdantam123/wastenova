import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, InputAdornment, Button,
  Card, CardContent, Chip, Divider, Skeleton, Alert, Stack,
  List, ListItem, ListItemIcon, ListItemText, Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLazyLookupItemQuery } from '../../api/recycleApi';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import type { RecyclingCategory } from '../../types/recycling';
import { useAppSelector } from '../../store/store';

const categoryIcon: Record<string, React.ReactNode> = {
  CURBSIDE: <LocalShippingIcon color="success" />,
  DROPOFF_CENTER: <LocationOnIcon color="warning" />,
  HAZARDOUS: <WarningAmberIcon color="error" />,
  MEDICAL_DROPOFF: <DeleteIcon color="error" />,
  NOT_RECYCLABLE: <CancelIcon color="disabled" />,
  COMPOST: <CheckCircleIcon color="success" />,
  REUSE: <InfoIcon color="info" />,
};

export function LookupResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeJurisdiction = useAppSelector((state) => state.location.active);
  const postalCode = useAppSelector((state) => state.location.postalCode);
  const [query, setQuery] = useState(searchParams.get('item') ?? '');
  const [searchInput, setSearchInput] = useState(searchParams.get('item') ?? '');
  const [lookupItem, { data: results = [], isFetching: loading, error }] = useLazyLookupItemQuery();

  const result = results[0] ?? null;
  const searched = Boolean(query);
  const relatedItems = useMemo(() => results.slice(1, 5).map((item) => item.itemName), [results]);
  const resultTips = result?.preparationSteps.length ? result.preparationSteps : result ? [result.notes] : [];
  const notFoundError = Boolean(error && typeof error === 'object' && 'status' in error && error.status === 404);

  useEffect(() => {
    const item = searchParams.get('item');
    setSearchInput(item ?? '');
    if (item && activeJurisdiction?.id) {
      setQuery(item);
      lookupItem({ item, jurisdictionId: activeJurisdiction.id });
    }
  }, [activeJurisdiction?.id, lookupItem, searchParams]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/lookup?item=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const suggestions = ['battery', 'pizza box', 'paint can', 'plastic', 'glass', 'electronics', 'medication', 'cardboard'];

  return (
    <Box>
      {/* Search bar sticky header */}
      <Box sx={{ bgcolor: 'background.paper', py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="md">
          {postalCode && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                Using ZIP code {postalCode}
              </Typography>
            </Box>
          )}
          <Box display="flex" gap={1} flexDirection={{ xs: 'column', sm: 'row' }}>
            <TextField
              fullWidth
              placeholder='Search for any item — e.g. "battery", "pizza box"'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              sx={{ bgcolor: 'white', borderRadius: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon /></InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained" size="large" onClick={handleSearch}
              sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, whiteSpace: 'nowrap' }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Loading skeleton */}
        {loading && (
          <Card elevation={2}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="70%" sx={{ mt: 1 }} />
              <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" />
            </CardContent>
          </Card>
        )}

        {/* No results */}
        {!loading && searched && !result && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {notFoundError
              ? <>We don't have specific guidance for <strong>"{query}"</strong> yet. Try a related term or a seeded jurisdiction.</>
              : !activeJurisdiction?.id
              ? 'Select or load a jurisdiction before searching.'
              : <>No guidance found for <strong>"{query}"</strong>.</>}
          </Alert>
        )}

        {/* Result card */}
        {!loading && result && (
          <Stack spacing={3}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
                  <Box>
                    <Typography variant="h5" fontWeight={700}>{result.itemName}</Typography>
                    <Typography variant="body2" color="text.secondary">Results for: "{query}"</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CategoryBadge category={result.category as RecyclingCategory} size="medium" />
                    {result.recyclable
                      ? <Chip icon={<CheckCircleIcon />} label="Accepted" color="success" variant="outlined" />
                      : <Chip icon={<CancelIcon />} label="Not in curbside" color="error" variant="outlined" />}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" gap={2} mb={2}>
                  <Box sx={{ color: 'primary.main', pt: 0.3 }}>
                    {categoryIcon[result.category] ?? <InfoIcon />}
                  </Box>
                  <Typography variant="body1">{result.notes}</Typography>
                </Box>

                {result.preparationSteps.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      How to prepare
                    </Typography>
                    <Typography variant="body2">{result.preparationSteps.join('. ')}</Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card elevation={1}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  ♻️ Pro Tips
                </Typography>
                <List dense disablePadding>
                  {resultTips.map((tip, i) => (
                    <ListItem key={i} disablePadding sx={{ alignItems: 'flex-start', mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 28, mt: 0.4 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Related */}
            {relatedItems.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  Other matching materials
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {relatedItems.map((r) => (
                    <Chip
                      key={r} label={r} size="small" variant="outlined"
                      onClick={() => navigate(`/lookup?item=${encodeURIComponent(r)}`)}
                      clickable
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        )}

        {/* Suggestions when no search yet */}
        {!loading && !searched && (
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Popular searches
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5} mb={4}>
              {suggestions.map((s) => (
                <Chip
                  key={s} label={s} variant="outlined" clickable
                  onClick={() => navigate(`/lookup?item=${encodeURIComponent(s)}`)}
                  sx={{ fontSize: '0.9rem', py: 1, px: 0.5 }}
                />
              ))}
            </Box>
            <Alert severity="info" icon={<InfoIcon />}>
              Search for any household item to find out how to recycle it in your area.
              Results come from the live backend for the active jurisdiction.
            </Alert>
          </Box>
        )}
      </Container>
    </Box>
  );
}
