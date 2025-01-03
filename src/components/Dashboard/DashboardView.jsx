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
  Stack,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import database from '../../utils/database';
import StatsCard from './StatsCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TourForm from '../Tours/TourForm';

const statusColors = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'error',
  'no-show': 'warning'
};

const formatPhoneNumber = (value) => {
  if (!value) return '';
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format the number as (XXX) XXX-XXXX
  if (cleaned.length >= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  return value; // Return original value if not properly formatted
};

export default function DashboardView() {
  const [stats, setStats] = useState({
    totalTours: 0,
    upcomingTours: 0,
    completedTours: 0,
    cancelledTours: 0
  });
  const [recentTours, setRecentTours] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

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
          let tourDate = null;
          
          if (t.tour_time) {
            // Handle new format with ISO string
            tourDate = new Date(t.tour_time);
          } else if (t.date && t.time) {
            // Handle old format with separate date and time
            const [year, month, day] = t.date.split('-');
            const [hour, minute] = t.time.split(':');
            tourDate = new Date(year, month - 1, day, hour, minute);
          }

          return tourDate && 
                 !isNaN(tourDate.getTime()) && 
                 tourDate > now && 
                 (!t.status || t.status === 'scheduled');
        }).length,
        completedTours: tours.filter(t => t.status === 'completed').length,
        cancelledTours: tours.filter(t => t.status === 'cancelled').length
      };
      setStats(stats);

      // Get recent tours - show only scheduled upcoming tours
      const recent = tours
        .filter(t => {
          // Get tour date
          let tourDate = null;
          if (t.tour_time) {
            // Ensure we're working with UTC dates consistently
            tourDate = new Date(t.tour_time);
          } else if (t.date && t.time) {
            const [year, month, day] = t.date.split('-');
            const [hour, minute] = t.time.split(':');
            tourDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
          }

          // Check if tour is scheduled and in the future
          const now = new Date();
          const isScheduled = !t.status || t.status === 'scheduled';
          
          // Debug logging for all tours
          console.log('Tour Debug:', {
            client: t.client_name,
            tourDate: tourDate?.toISOString(),
            now: now.toISOString(),
            isScheduled,
            isFuture: tourDate > now,
            status: t.status,
            rawTourTime: t.tour_time
          });

          return isScheduled && tourDate > now;
        })
        .sort((a, b) => {
          let dateA = new Date(a.tour_time);
          let dateB = new Date(b.tour_time);
          
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
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return isNaN(dateA.getTime()) ? 1 : -1;
          }
          
          return dateA.getTime() - dateB.getTime();
        });
      
      // Added debug logging
      console.log('Filtered recent tours:', recent.map(t => ({
        client: t.client_name,
        date: t.date,
        time: t.time,
        tour_time: t.tour_time,
        status: t.status
      })));

      setRecentTours(recent);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        console.error('Invalid tour ID');
        return;
      }
      await window.api.database.deleteTour(id);
      await loadDashboardData();
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setSelectedTour(null);
  };

  const handleFormSubmit = async (tourData) => {
    try {
      if (selectedTour) {
        const { _id, created_at, updated_at, ...updateData } = tourData;
        await window.api.database.updateTour(selectedTour._id, updateData);
      }
      await loadDashboardData();
      handleFormClose();
    } catch (error) {
      console.error('Error saving tour:', error);
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
                  tourDate = new Date(tour.tour_time);
                } else if (tour.date && tour.time) {
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
                      <Box>
                        <IconButton onClick={() => handleEdit(tour)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(tour._id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                        <Chip
                          label={tour.status || 'scheduled'}
                          color={statusColors[tour.status || 'scheduled']}
                          size="small"
                          sx={{ ml: 1, minWidth: 85 }}
                        />
                      </Box>
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
                            <span>📱</span> {formatPhoneNumber(tour.phone_number)}
                          </Box>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>🏘️</span> {tour.property_address}
                          </Box>
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span>📅</span> {formattedDate}
                          </Box>
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

      <TourForm
        open={openForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        tour={selectedTour}
      />
    </Box>
  );
}