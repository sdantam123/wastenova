import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Divider, Alert, Link,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRegisterMutation } from '../../api/recycleApi';
import { useAppDispatch } from '../../store/store';
import { setUser, setToken } from '../../store/authSlice';
import { resolveZipFromAddress } from '../../utils/resolveZipFromAddress';

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerMutation] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!zipCode || zipCode.length !== 5) { setError('Please enter a valid 5-digit ZIP code.'); return; }
    setLoading(true);
    try {
      const response = await registerMutation({
        name,
        email,
        password,
        address: address || undefined,
        postal_code: zipCode,
      }).unwrap();
      dispatch(setUser({
        uid: String(response.user.id),
        email: response.user.email ?? email,
        displayName: response.user.name ?? name,
        roles: ['RESIDENT'],
      }));
      dispatch(setToken(response.access_token));
      void resolveZipFromAddress(dispatch, response.user.address, response.user.postal_code);
      navigate('/');
    } catch (err: unknown) {
      const status = typeof err === 'object' && err !== null && 'status' in err
        ? (err as { status?: number }).status
        : undefined;
      const detail = typeof err === 'object' && err !== null && 'data' in err
        ? (err as { data?: { detail?: string } }).data?.detail
        : undefined;
      if (status === 422 && detail) {
        setError(detail);
      } else if (status === 409) {
        setError('That email is already registered. Try signing in instead.');
      } else {
        setError('Could not create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #ecfeff 0%, #eff6ff 45%, #f8fafc 100%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1.2} mb={3}>
          <Box
            sx={{
              bgcolor: 'primary.main', borderRadius: '50%',
              width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 12px 28px rgba(15, 118, 110, 0.28)',
            }}
          >
            <RecyclingIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="primary.dark">
            WasteNova
          </Typography>
        </Box>

        <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(15, 23, 42, 0.08)', boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)' }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Create your free account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Join the community making recycling easier and smarter.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth label="Full name" required
                value={name} onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth label="Email address" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth label="Password" required
                type={showPw ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                helperText="Minimum 8 characters"
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><LockIcon fontSize="small" color="action" /></InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPw((v) => !v)} edge="end">
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth label="Address"
                value={address} onChange={(e) => setAddress(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><LocationOnIcon fontSize="small" color="action" /></InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth label="ZIP code" required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
                helperText="Must be a ZIP code we currently support"
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start"><LocationOnIcon fontSize="small" color="action" /></InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{ mb: 2, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 3 }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary" fontWeight={600}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
