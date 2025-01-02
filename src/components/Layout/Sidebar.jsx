import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  styled
} from '@mui/material';

const DRAWER_WIDTH = 280;

const StyledDrawer = styled(Drawer)({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
    marginTop: '32px',
    height: 'calc(100% - 32px)'
  },
});

const NavItem = styled(ListItem)(({ theme, active }) => ({
  margin: '4px 12px',
  borderRadius: '8px',
  color: theme.palette.grey[100],
  '&:hover': {
    backgroundColor: '#3D3D3D',
  },
  ...(active && {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const navItems = [
  { label: 'Dashboard', icon: '📊', path: '/' },
  { label: 'Tours', icon: '🗓️', path: '/tours' },
  { label: 'Properties', icon: '🏘️', path: '/properties' },
  { label: 'Reports', icon: '📈', path: '/reports' },
  { label: 'Settings', icon: '⚙️', path: '/settings' }
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Typography variant="h4" component="span" sx={{ mr: 1 }}>
            🏠
          </Typography>
          <Typography variant="h4" component="span" fontWeight="bold">
            TourSync
          </Typography>
        </Box>

        <List>
          {navItems.map(({ label, icon, path }) => (
            <NavItem
              button
              key={path}
              active={location.pathname === path ? 1 : 0}
              onClick={() => navigate(path)}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={label} />
            </NavItem>
          ))}
        </List>
      </Box>
    </StyledDrawer>
  );
}

export default Sidebar; 