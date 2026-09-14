import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { clearUser } from '../../store/authSlice';
import { clearLocation } from '../../store/locationSlice';
import { ZipLookupForm } from '../location/ZipLookupForm';

interface TopBarProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
  /** When true, the hamburger only shows on mobile (xs/sm) and desktop nav links stay visible. */
  mobileMenuOnly?: boolean;
}

export function TopBar({ onMenuToggle, showMenu = false, mobileMenuOnly = false }: TopBarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const active = useAppSelector((s) => s.location.active);
  const postalCode = useAppSelector((s) => s.location.postalCode);
  const user = useAppSelector((s) => s.auth.user);
  const [zipAnchorEl, setZipAnchorEl] = useState<HTMLElement | null>(null);
  const zipPopoverOpen = Boolean(zipAnchorEl);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<HTMLElement | null>(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  const handleLogout = () => {
    setUserMenuAnchorEl(null);
    dispatch(clearUser());
    dispatch(clearLocation());
    navigate('/');
  };

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ minHeight: { xs: 72, md: 80 } }}>
        {showMenu && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuToggle}
            sx={{ mr: 1, color: 'text.primary', display: mobileMenuOnly ? { xs: 'inline-flex', md: 'none' } : 'inline-flex' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer', mr: 3 }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <RecyclingIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              WasteNova
            </Typography>
            <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}>
              Smart waste guidance
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Typography
          variant="body2"
          sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary', mr: 2, whiteSpace: 'nowrap' }}
        >
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </Typography>

        <Chip icon={<MenuBookIcon />} label="Local Guide" size="small" sx={{ bgcolor: 'background.paper', color: 'text.primary', mr: 1.5, border: '1px solid', borderColor: 'divider' }} />

        <Chip
          icon={<LocationOnIcon />}
          label={active ? (postalCode ? `${postalCode} · ${active.township}` : active.township) : 'Set ZIP code'}
          size="small"
          clickable
          sx={{ bgcolor: 'background.paper', color: 'text.primary', mr: 2, border: '1px solid', borderColor: 'divider' }}
          onClick={(e) => setZipAnchorEl(e.currentTarget)}
        />

        <Popover
          open={zipPopoverOpen}
          anchorEl={zipAnchorEl}
          onClose={() => setZipAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ p: 2.5, width: 320 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {active ? 'Change your ZIP code' : 'Set your ZIP code'}
            </Typography>
            <ZipLookupForm autoFocus onResolved={() => setZipAnchorEl(null)} />
          </Box>
        </Popover>

        {user ? (
          <>
            <Box
              onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', borderRadius: 999, px: 1, py: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <Avatar sx={{ width: 28, height: 28, fontSize: '0.85rem', bgcolor: 'primary.main' }}>
                {user.displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {user.displayName}
              </Typography>
            </Box>
            <Menu
              anchorEl={userMenuAnchorEl}
              open={userMenuOpen}
              onClose={() => setUserMenuAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" variant="outlined" size="small" onClick={() => navigate('/login')} sx={{ borderColor: 'rgba(255,255,255,0.3)', borderRadius: 999 }}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
