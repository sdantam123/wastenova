import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { useNavigate, useLocation } from 'react-router-dom';
import { categoryNavItems } from '../../features/programs/categoryNav';

export const CATEGORY_SIDEBAR_WIDTH = 240;

interface CategorySidebarProps {
  open: boolean;
  variant?: 'permanent' | 'temporary';
  onClose?: () => void;
}

export function CategorySidebar({ open, variant = 'permanent', onClose }: CategorySidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeParams = new URLSearchParams(location.search);
  const activeCategory = location.pathname === '/programs' ? activeParams.get('category') : null;

  const handleClick = (key: string, linkTo?: string) => {
    if (linkTo) {
      navigate(linkTo);
    } else {
      navigate(`/programs?category=${key}`);
    }
    onClose?.();
  };

  const content = (
    <Box sx={{ width: CATEGORY_SIDEBAR_WIDTH, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <RecyclingIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={700}>WasteNova</Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        {categoryNavItems.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeCategory === item.key}
              onClick={() => handleClick(item.key, item.linkTo)}
              sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'primary.light', color: 'primary.dark' } }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: CATEGORY_SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: CATEGORY_SIDEBAR_WIDTH, boxSizing: 'border-box', borderRight: '1px solid rgba(15,23,42,0.08)' },
      }}
    >
      {content}
    </Drawer>
  );
}
