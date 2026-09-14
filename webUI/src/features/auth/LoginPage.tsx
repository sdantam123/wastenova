import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Divider, Alert, Link,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLoginMutation } from '../../api/recycleApi';
import { useAppDispatch } from '../../store/store';
import { setUser, setToken } from '../../store/authSlice';
import { resolveZipFromAddress } from '../../utils/resolveZipFromAddress';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMutation] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const response = await loginMutation({ email, password }).unwrap();
      dispatch(setUser({
        uid: String(response.user.id),
        email: response.user.email ?? email,
        displayName: response.user.name ?? (response.user.email ?? email).split('@')[0],
        roles: [response.user.email === 'admin@example.com' ? 'ADMIN' : 'RESIDENT'],
      }));
      dispatch(setToken(response.access_token));
      void resolveZipFromAddress(dispatch, response.user.address, response.user.postal_code);
      navigate(response.user.email === 'admin@example.com' ? '/admin' : '/programs?category=home');
    } catch {
      setError('Invalid credentials. Register first if you do not have an account yet.');
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
      <Box sx={{ width: '100%', maxWidth: 440 }}>
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
              Sign in to your account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Access your pickup schedule, recycling guidance, and more.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
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
                sx={{ mb: 3 }}
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
              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{ mb: 2, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 3 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" color="primary" fontWeight={600}>
                Create one free
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
