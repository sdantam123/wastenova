import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLazyResolveByPostalQuery, useGetJurisdictionsQuery } from '../../api/recycleApi';
import { setPostalCode, setResolvedJurisdiction } from '../../store/locationSlice';
import { useAppDispatch, useAppSelector } from '../../store/store';

interface ZipLookupFormProps {
  onResolved?: () => void;
  autoFocus?: boolean;
}

export function ZipLookupForm({ onResolved, autoFocus = false }: ZipLookupFormProps) {
  const dispatch = useAppDispatch();
  const savedZip = useAppSelector((s) => s.location.postalCode);
  const [zipCode, setZipCode] = useState(savedZip ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [resolveByPostal, { isFetching: resolving }] = useLazyResolveByPostalQuery();
  const { data: jurisdictions = [] } = useGetJurisdictionsQuery();

  const handleZipLookup = async () => {
    const cleanedZip = zipCode.trim();
    if (!cleanedZip) return;

    setMessage(null);

    try {
      const resolved = await resolveByPostal({ postalCode: cleanedZip, countryCode: 'US' }).unwrap();
      dispatch(setPostalCode(cleanedZip));
      const jurisdiction = jurisdictions.find((item) => item.id === resolved.jurisdiction_id)
        ?? jurisdictions.find((item) => item.postalCodes?.includes(cleanedZip));
      if (jurisdiction) {
        dispatch(setResolvedJurisdiction(jurisdiction));
        onResolved?.();
      } else {
        setMessage('This ZIP code is not available in our database yet.');
      }
    } catch (error: unknown) {
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: number | string }).status
        : undefined;
      if (status === 404) {
        setMessage('This ZIP code is not available in our database yet.');
      } else {
        setMessage('We could not verify that ZIP code right now. Please try again.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 1.2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>
        <TextField
          fullWidth
          autoFocus={autoFocus}
          placeholder="ZIP code, e.g. 08536"
          value={zipCode}
          onChange={(e) => {
            setZipCode(e.target.value);
            if (message) setMessage(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && void handleZipLookup()}
          sx={{ bgcolor: 'white', borderRadius: 3, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><LocationOnIcon /></InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => void handleZipLookup()}
          disabled={resolving}
          sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' }, whiteSpace: 'nowrap', px: 3 }}
        >
          {resolving ? 'Checking…' : 'Check ZIP'}
        </Button>
      </Box>
      {message && (
        <Alert severity="warning" sx={{ mt: 1.5 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
