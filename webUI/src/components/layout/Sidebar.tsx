import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RuleIcon from '@mui/icons-material/Rule';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { clearUser } from '../../store/authSlice';
import { clearLocation } from '../../store/locationSlice';

const DRAWER_WIDTH = 240;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Rules', icon: <RuleIcon />, path: '/admin/rules' },
  { label: 'Schedules', icon: <CalendarMonthIcon />, path: '/admin/schedules' },
  { label: 'Centers', icon: <LocationOnIcon />, path: '/admin/centers' },
  { label: 'Analytics', icon: <BarChartIcon />, path: '/admin/analytics' },
];

interface SidebarProps {
  open: boolean;
  variant?: 'permanent' | 'temporary';
  onClose?: () => void;
}

export function Sidebar({ open, variant = 'permanent', onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearLocation());
    navigate('/');
    onClose?.();
  };

  const content = (
    <Box sx={{ width: DRAWER_WIDTH, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ px: 2.5, py: 3, background: 'linear-gradient(135deg, #0F766E 0%, #2563EB 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
          <Box sx={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.18)' }}>
            <RecyclingIcon />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              WasteNova
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Admin Portal
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {navItems.map(({ label, icon, path }) => (
          <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === path}
              onClick={() => { navigate(path); onClose?.(); }}
              sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.dark' } }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: location.pathname === path ? 'primary.dark' : 'text.secondary' }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid rgba(15,23,42,0.08)' },
      }}
    >
      {content}
    </Drawer>
  );
}
