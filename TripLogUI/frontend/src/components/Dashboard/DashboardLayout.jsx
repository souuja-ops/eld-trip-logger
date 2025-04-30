import React, { useState } from 'react';
import { 
  CssBaseline, 
  useTheme,
  useMediaQuery,
  Box,
  styled,
  alpha 
} from '@mui/material';
import { Outlet } from 'react-router-dom'; // Import Outlet for rendering child routes
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isCollapsed, setIsCollapsed] = useState(false); // Shared state for sidebar collapse
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Styled components
  const MainContent = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: isMobile ? 0 : isCollapsed ? 72 : 240, // Adjust margin based on sidebar state
    minHeight: '100vh',
    position: 'relative',
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
        minHeight: '100vh',
        backgroundImage: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.light,
          0.05
        )} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar 
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* Main Content */}
        <MainContent>
          <Outlet /> {/* Render child routes dynamically */}
        </MainContent>
      </Box>
    </Box>
  );
};

export default DashboardLayout;