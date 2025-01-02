import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import database from '../../utils/database';
import StatsCard from './StatsCard';

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
      
      // Calculate stats
      const now = new Date();
      const stats = {
        totalTours: tours.length,
        upcomingTours: tours.filter(t => {
          const tourDate = new Date(t.tourTime);
          return tourDate > now && t.status === 'scheduled';
        }).length,
        completedTours: tours.filter(t => t.status === 'completed').length,
        cancelledTours: tours.filter(t => t.status === 'cancelled').length
      };
      setStats(stats);

      // Get recent tours - only upcoming scheduled tours
      const recent = tours
        .filter(t => {
          const tourDate = new Date(t.tourTime);
          return tourDate > now && t.status === 'scheduled';
        })
        .sort((a, b) => new Date(a.tourTime) - new Date(b.tourTime))
        .slice(0, 5);
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
                const tourDate = new Date(tour.tourTime);
                const formattedDate = !isNaN(tourDate.getTime()) 
                  ? format(tourDate, 'PPp')
                  : 'Invalid Date';

                return (
                  <React.Fragment key={`${tour._id}-${index}`}>
                    <ListItem>
                      <ListItemText
                        primary={tour.clientName}
                        secondary={`${tour.propertyAddress} - ${formattedDate}`}
                      />
                    </ListItem>
                    {index < recentTours.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}