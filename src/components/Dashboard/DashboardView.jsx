import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import database from '../../utils/database';
import StatsCard from './StatsCard';

const statusColors = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'error',
  'no-show': 'warning'
};

export default function DashboardView() {
  const [stats, setStats] = useState({
    totalTours: 0,
    upcomingTours: 0,
    completedTours: 0,
    cancelledTours: 0
  });
  const [recentTours, setRecentTours] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const tours = await window.api.database.getTours();
      console.log('Fetched tours:', tours);
      
      // Calculate stats
      const now = new Date();
      const stats = {
        totalTours: tours.length,
        upcomingTours: tours.filter(t => {
          const tourDate = new Date(t.tour_time);
          return !isNaN(tourDate.getTime()) && 
                 tourDate > now && 
                 (!t.status || t.status === 'scheduled');
        }).length,
        completedTours: tours.filter(t => t.status === 'completed').length,
        cancelledTours: tours.filter(t => t.status === 'cancelled').length
      };
      setStats(stats);

      // Get recent tours - show all scheduled tours regardless of date
      const recent = tours
        .filter(t => (!t.status || t.status === 'scheduled'))
        .sort((a, b) => {
          let dateA = new Date(a.tour_time);
          let dateB = new Date(b.tour_time);
          
          // If date is invalid, try parsing from separate date and time fields
          if (isNaN(dateA.getTime()) && a.date && a.time) {
            const [yearA, monthA, dayA] = a.date.split('-');
            const [hourA, minuteA] = a.time.split(':');
            dateA = new Date(yearA, monthA - 1, dayA, hourA, minuteA);
          }
          
          if (isNaN(dateB.getTime()) && b.date && b.time) {
            const [yearB, monthB, dayB] = b.date.split('-');
            const [hourB, minuteB] = b.time.split(':');
            dateB = new Date(yearB, monthB - 1, dayB, hourB, minuteB);
          }
          
          // Ensure both dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return isNaN(dateA.getTime()) ? 1 : -1;
          }
          
          // Compare timestamps for sorting
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5);
      
      console.log('Filtered recent tours:', recent);
      setRecentTours(recent);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Tours" value={stats.totalTours} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Upcoming Tours" value={stats.upcomingTours} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Completed Tours" value={stats.completedTours} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Cancelled Tours" value={stats.cancelledTours} color="error" />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Tours</Typography>
            <List>
              {recentTours.map((tour, index) => {
                let tourDate = null;
                
                if (tour.tour_time) {
                  // Handle new format with ISO string
                  tourDate = new Date(tour.tour_time);
                } else if (tour.date && tour.time) {
                  // Handle old format with separate date and time
                  const [year, month, day] = tour.date.split('-');
                  const [hour, minute] = tour.time.split(':');
                  tourDate = new Date(year, month - 1, day, hour, minute);
                }

                const formattedDate = tourDate && !isNaN(tourDate.getTime())
                  ? format(tourDate, 'PPp')
                  : 'Invalid Date';

                return (
                  <ListItem 
                    key={`${tour._id}-${index}`}
                    sx={{
                      bgcolor: index % 2 === 0 ? 'background.default' : 'background.paper',
                      borderRadius: 1,
                      my: 0.5,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                    secondaryAction={
                      <Chip
                        label={tour.status || 'scheduled'}
                        color={statusColors[tour.status || 'scheduled']}
                        size="small"
                        sx={{ minWidth: 85 }}
                      />
                    }
                  >
                    <ListItemText
                      primary={
                        <Box component="span" sx={{ fontWeight: 'medium' }}>
                          {tour.client_name}
                        </Box>
                      }
                      secondary={
                        <Stack spacing={0.5} component="span">
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>📍</span> {tour.property_address}
                          </Box>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>🕒</span> {formattedDate}
                          </Box>
                          {tour.phone_number && (
                            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>📱</span> {tour.phone_number}
                            </Box>
                          )}
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}