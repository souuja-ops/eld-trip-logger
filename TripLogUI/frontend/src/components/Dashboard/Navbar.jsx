import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, IconButton, InputBase, 
  Badge, Avatar, Box, alpha, useTheme,
  Typography, Menu, MenuItem, Divider,
  ListItemIcon, ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backdropFilter: 'blur(12px)',
  backgroundColor: alpha(theme.palette.background.default, 0.85),
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
}));

const SearchField = styled(InputBase)(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  borderRadius: 20,
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.action.hover, 0.05),
  transition: theme.transitions.create(['width', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.1),
  },
  '&.Mui-focused': {
    backgroundColor: alpha(theme.palette.action.hover, 0.15),
    width: '100%',
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1),
    transition: theme.transitions.create('width'),
  },
}));

const Navbar = ({ 
  onMenuClick, // Sidebar toggle function
  toggleTheme,
  isDarkMode
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchor);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const menuId = 'primary-search-account-menu';
  const notificationsId = 'notifications-menu';

  return (
    <StyledAppBar 
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(12px)',
        backgroundColor: scrolled 
          ? alpha(theme.palette.background.default, 0.95) 
          : alpha(theme.palette.background.default, 0.85),
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        minHeight: 64,
        px: { xs: 2, sm: 3 }
      }}>
        {/* Left Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 }
        }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMenuClick} // Toggle sidebar
            sx={{ mr: 1 }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>

          <AnimatePresence>
            {!searchFocused && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ 
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 700,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
                      : 'linear-gradient(45deg, #1976d2 30%, #0d47a1 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  TripLog
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            layout
            style={{ 
              flexGrow: 1,
              maxWidth: searchFocused ? '100%' : 400
            }}
          >
            <SearchField
              placeholder="Search trips, drivers..."
              startAdornment={
                <SearchIcon 
                  sx={{ 
                    mr: 1,
                    color: theme.palette.text.secondary
                  }} 
                />
              }
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>
        </Box>

        {/* Right Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: { xs: 0.5, sm: 1 }
        }}>
          <IconButton
            size="large"
            aria-label="toggle theme"
            color="inherit"
            onClick={toggleTheme}
          >
            {isDarkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          <IconButton
            size="large"
            aria-label="show notifications"
            aria-controls={notificationsId}
            aria-haspopup="true"
            onClick={handleNotificationsOpen}
            color="inherit"
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar 
              src="/avatar.jpg"
              sx={{ 
                width: 36, 
                height: 36,
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: theme.shadows[1]
              }}
            />
          </IconButton>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={notificationsId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isNotificationsOpen}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: '100%',
            mt: 1.5,
            p: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 600 }}>
          Notifications (3)
        </Typography>
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          New trip assigned
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 220,
            mt: 1.5,
            p: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleMenuClose();
          toggleTheme();
        }}>
          <ListItemIcon>
            {isDarkMode ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>
            Logout
          </ListItemText>
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
};

export default Navbar;