import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import database from '../../utils/database';

const TOUR_STATUS = ['scheduled', 'completed', 'cancelled', 'no-show'];

export default function TourForm({ open, onClose, tour, onSubmit }) {
  const [formData, setFormData] = useState({
    client_name: '',
    phone_number: '',
    property_id: '',
    property_address: '',
    tour_date: '',
    tour_time: '',
    period: 'AM',
    status: 'scheduled',
    notes: ''
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (tour) {
      try {
        const tourDate = new Date(tour.tour_time);
        
        if (!isNaN(tourDate.getTime())) {
          setFormData({
            ...tour,
            tour_date: tourDate.toISOString().split('T')[0],
            tour_time: tourDate.toTimeString().slice(0, 5),
            property_id: tour.property_id || '',
            property_address: tour.property_address || '',
            period: tourDate.getHours() >= 12 ? 'PM' : 'AM',
            status: tour.status || 'scheduled'
          });
        } else {
          setDefaultFormData(new Date());
        }
      } catch (error) {
        console.error('Error parsing tour date:', error);
        setDefaultFormData(new Date());
      }
    } else {
      setDefaultFormData(new Date());
    }
  }, [tour]);

  const setDefaultFormData = (date) => {
    setFormData({
      client_name: '',
      phone_number: '',
      property_id: '',
      property_address: '',
      tour_date: date.toISOString().split('T')[0],
      tour_time: date.toTimeString().slice(0, 5),
      period: date.getHours() >= 12 ? 'PM' : 'AM',
      status: 'scheduled',
      notes: ''
    });
  };

  const loadProperties = async () => {
    try {
      const data = await database.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handlePropertyChange = (event) => {
    const selectedProperty = properties.find(p => p._id === event.target.value);
    if (selectedProperty) {
      setFormData({
        ...formData,
        property_id: selectedProperty._id,
        property_address: selectedProperty.address
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const [year, month, day] = formData.tour_date.split('-');
    const [hours, minutes] = formData.tour_time.split(':');
    
    // Convert 12-hour to 24-hour format
    let hour = parseInt(hours);
    if (formData.period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (formData.period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    const tourDateTime = new Date(year, month - 1, day, hour, parseInt(minutes));

    const submissionData = {
      ...formData,
      tour_time: tourDateTime.toISOString(),
      client_name: formData.client_name.trim(),
      phone_number: formData.phone_number.trim(),
    };
    onSubmit(submissionData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tour ? 'Edit Tour' : 'New Tour'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Client Name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Property"
                value={formData.property_id}
                onChange={handlePropertyChange}
                required
              >
                {properties.map((property) => (
                  <MenuItem key={property._id} value={property._id}>
                    {property.address} - {property.bedrooms}bd/{property.bathrooms}ba ${property.rent_price}/mo
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Tour Date"
                value={formData.tour_date}
                onChange={(e) => setFormData({ ...formData, tour_date: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Tour Time"
                value={formData.tour_time}
                onChange={(e) => {
                  let value = e.target.value;
                  
                  // Remove any non-digit or colon characters
                  value = value.replace(/[^\d:]/g, '');
                  
                  // Handle the input formatting
                  if (value.length === 1 || value.length === 2) {
                    const hour = parseInt(value);
                    if (hour >= 0 && hour <= 12) {
                      if (value.length === 2 && !value.includes(':')) {
                        value = `${value}:`;
                      }
                    }
                  } else if (value.length > 2 && !value.includes(':')) {
                    // Add colon after the first two digits if missing
                    value = `${value.slice(0, 2)}:${value.slice(2)}`;
                  }
                  
                  // Validate the final format (H:mm, HH:mm)
                  if (value.length <= 5 && /^([0-9]|0[0-9]|1[0-2])?:?([0-5]?[0-9]?)?$/.test(value)) {
                    setFormData({ ...formData, tour_time: value });
                  }
                }}
                placeholder="HH:mm"
                inputProps={{
                  maxLength: 5
                }}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="AM/PM"
                value={formData.period || 'AM'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                required
              >
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="PM">PM</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                {TOUR_STATUS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 