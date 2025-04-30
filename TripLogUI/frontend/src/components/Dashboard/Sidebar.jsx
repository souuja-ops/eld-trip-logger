import React from 'react';
import { 
  Drawer, List, ListItemButton, ListItemIcon, 
  ListItemText, useTheme, Divider,
  Box, styled, Tooltip, useMediaQuery
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ListAlt as LogsIcon,
  Map as MapIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

// Fix: Use shouldForwardProp to prevent `isCollapsed` from being passed to the DOM
const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'isCollapsed', // Filter out isCollapsed
})(({ theme, isCollapsed }) => ({
  '& .MuiDrawer-paper': {
    width: isCollapsed ? 0 : 280, // Fully collapse on mobile/tablet
    background: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.9) 
      : alpha(theme.palette.background.paper, 0.95),
    backdropFilter: 'blur(12px)',
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    overflowX: 'hidden',
    boxShadow: theme.shadows[2],
    top: 64, // Offset to match the Navbar height
    height: 'calc(100% - 64px)', // Adjust height to avoid overlapping the Navbar
  },
  '& .MuiDrawer-paperAnchorDockedLeft': {
    borderRight: 'none',
  },
}));

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detect tablet/mobile screens

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon fontSize="medium" />, 
      path: '/',
      aria: 'Navigate to Dashboard',
    },
    { 
      text: 'Trip Logs', 
      icon: <LogsIcon fontSize="medium" />, 
      path: '/trips',
      aria: 'Navigate to Trip Logs',
    },
    { 
      text: 'Live Map', 
      icon: <MapIcon fontSize="medium" />, 
      path: '/map',
      aria: 'Navigate to Live Map',
    },
    { 
      text: 'Settings', 
      icon: <SettingsIcon fontSize="medium" />, 
      path: '/settings',
      aria: 'Navigate to Settings',
    },
  ];

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsCollapsed(true); // Collapse the sidebar on mobile/tablet
    }
  };

  return (
    <StyledDrawer
      variant="permanent"
      open={!isCollapsed} // Sidebar is fully collapsed when `isCollapsed` is true
      isCollapsed={isCollapsed} // Pass dynamic width for styling
    >
      <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

      {/* Sidebar Menu Items */}
      <List disablePadding sx={{ pt: 1 }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Tooltip 
              title={isCollapsed ? item.text : ''} 
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                aria-label={item.aria}
                onClick={handleMenuItemClick} // Collapse sidebar on click
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.05),
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    color: location.pathname === item.path 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                {!isCollapsed && (
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      color: location.pathname === item.path 
                        ? 'text.primary' 
                        : 'text.secondary',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </motion.div>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;