import React from 'react';
import { 
  Box, Grid, Typography, Paper, useTheme, 
  useMediaQuery, styled, Stack, Divider,
} from '@mui/material';
import { 
  DirectionsCar as ActiveIcon,
  CheckCircle as CompletedIcon,
  Explore as OngoingIcon,
  Timeline as HoursIcon,
  TrendingUp as ChartIcon,
  RecentActors as RecentIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  minHeight: 'calc(100vh - 64px)', // Adjust height to account for Navbar
  background: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  overflow: 'auto', // Ensure scrolling if content overflows
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  height: '100%',
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.standard,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const SectionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  background: theme.palette.background.paper,
  height: '100%',
}));

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const stats = [
    { 
      title: 'Active Vehicles', 
      value: '42', 
      icon: <ActiveIcon fontSize="large" />, 
      color: theme.palette.primary.main,
      change: '+2%',
    },
    { 
      title: 'Completed Trips', 
      value: '1.2K', 
      icon: <CompletedIcon fontSize="large" />, 
      color: theme.palette.success.main,
      change: '+15%',
    },
    { 
      title: 'Ongoing Trips', 
      value: '18', 
      icon: <OngoingIcon fontSize="large" />, 
      color: theme.palette.warning.main,
      change: '-3%',
    },
    { 
      title: 'Total Hours', 
      value: '540h', 
      icon: <HoursIcon fontSize="large" />, 
      color: theme.palette.info.main,
      change: '+8%',
    },
  ];

  const recentActivities = [
    { id: 1, text: 'New trip assigned to Driver #142', time: '2 mins ago' },
    { id: 2, text: 'Vehicle #25 completed maintenance', time: '1 hour ago' },
    { id: 3, text: 'New driver onboarded', time: '3 hours ago' },
    { id: 4, text: 'Monthly report generated', time: '1 day ago' },
  ];

  return (
    <DashboardContainer>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700,
          mb: 1,
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)'
            : 'linear-gradient(45deg, #1976d2 30%, #0d47a1 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Trip Analytics Hub
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of your fleet operations
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item key={stat.title} xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard elevation={0}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${alpha(stat.color, 0.7)} 100%)`,
                    color: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: stat.change.startsWith('+') 
                          ? theme.palette.success.main 
                          : theme.palette.error.main,
                      }}
                    >
                      {stat.change} from last week
                    </Typography>
                  </Box>
                </Stack>
              </StatCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts & Recent Activity Section */}
      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <SectionCard elevation={0}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <ChartIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Trip Analytics
                </Typography>
              </Stack>
              <Box sx={{ 
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: alpha(theme.palette.action.hover, 0.05),
                borderRadius: 2,
              }}>
                <Typography color="text.secondary">
                  Chart Component Placeholder
                </Typography>
              </Box>
            </SectionCard>
          </motion.div>
        </Grid>

        {/* Recent Activity Section */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <SectionCard elevation={0}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <RecentIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Recent Activity
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {recentActivities.map((activity) => (
                  <Box key={activity.id}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {activity.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>
            </SectionCard>
          </motion.div>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;