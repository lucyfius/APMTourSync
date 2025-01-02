import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TourForm from './TourForm';
import { format } from 'date-fns';
import database from '../../utils/database';

const statusColors = {
  scheduled: 'primary',
  completed: 'success',
  cancelled: 'error',
  'no-show': 'warning'
};

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [tabValue, setTabValue] = useState('scheduled');

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      const data = await window.api.database.getTours();
      console.log('Tour dates:', data.map(tour => ({
        client: tour.client_name,
        tour_time: tour.tour_time,
        parsed: new Date(tour.tour_time)
      })));
      setTours(data);
    } catch (error) {
      console.error('Error loading tours:', error);
    }
  };

  const filteredTours = tours
    .filter(tour => {
      const status = tour.status || 'scheduled';
      return status === tabValue;
    })
    .sort((a, b) => {
      const dateA = new Date(a.tour_time);
      const dateB = new Date(b.tour_time);
      
      // For scheduled tours, sort by upcoming (ascending)
      if (tabValue === 'scheduled') {
        return dateA - dateB;
      }
      // For completed, cancelled, and no-show tours, sort by most recent (descending)
      return dateB - dateA;
    });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAdd = () => {
    setSelectedTour(null);
    setOpenForm(true);
  };

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting tour with ID:', id);
      if (!id) {
        console.error('Invalid tour ID');
        return;
      }
      await window.api.database.deleteTour(id);
      await loadTours();
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
        await window.api.database.updateTour(selectedTour._id, tourData);
      } else {
        await window.api.database.createTour(tourData);
      }
      await loadTours();
      handleFormClose();
    } catch (error) {
      console.error('Error saving tour:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Tours</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Tour
        </Button>
      </Box>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="Scheduled" value="scheduled" />
        <Tab label="Completed" value="completed" />
        <Tab label="Cancelled" value="cancelled" />
        <Tab label="No Show" value="no-show" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Property</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTours.map((tour, index) => {
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
                
              const uniqueKey = tour._id && tour._id.$oid ? tour._id.$oid : `tour-${index}`;
              
              return (
                <TableRow key={uniqueKey}>
                  <TableCell>{tour.client_name}</TableCell>
                  <TableCell>{tour.property_address}</TableCell>
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={tour.status || 'scheduled'}
                      color={statusColors[tour.status || 'scheduled']}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(tour)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(tour._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TourForm
        open={openForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        tour={selectedTour}
      />
    </Box>
  );
} 
