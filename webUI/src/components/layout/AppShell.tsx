import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { CategorySidebar } from './CategorySidebar';
import { useAppSelector } from '../../store/store';

interface AppShellProps {
  variant?: 'public' | 'admin';
}

export function AppShell({ variant = 'public' }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = variant === 'admin';
  const active = useAppSelector((s) => s.location.active);
  const savedZip = useAppSelector((s) => s.location.postalCode);
  const showCategorySidebar = !isAdmin && Boolean(active && savedZip);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar
        showMenu={isAdmin || showCategorySidebar}
        mobileMenuOnly={!isAdmin && showCategorySidebar}
        onMenuToggle={() => setMobileOpen((v) => !v)}
      />

      {isAdmin && (
        <>
          {/* Permanent sidebar on desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Toolbar />
            <Sidebar open variant="permanent" />
          </Box>
          {/* Temporary drawer on mobile */}
          <Sidebar
            open={mobileOpen}
            variant="temporary"
            onClose={() => setMobileOpen(false)}
          />
        </>
      )}

      {showCategorySidebar && (
        <>
          {/* Permanent sidebar on desktop */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Toolbar />
            <CategorySidebar open variant="permanent" />
          </Box>
          {/* Temporary drawer on mobile */}
          <CategorySidebar
            open={mobileOpen}
            variant="temporary"
            onClose={() => setMobileOpen(false)}
          />
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
