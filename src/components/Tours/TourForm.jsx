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
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import database from '../../utils/database';

const TOUR_STATUS = ['scheduled', 'completed', 'cancelled', 'no-show'];

export default function TourForm({ open, onClose, tour, onSubmit }) {
  const [formData, setFormData] = useState({
    client_name: '',
    phone_number: '',
    property_address: '',
    tour_time: new Date(),
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    if (tour) {
      setFormData({
        ...tour,
        tour_time: tour.tour_time ? new Date(tour.tour_time) : new Date()
      });
    } else {
      // Reset form for new tours
      setFormData({
        client_name: '',
        phone_number: '',
        property_address: '',
        tour_time: new Date(),
        status: 'scheduled',
        notes: ''
      });
    }
  }, [tour]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      tour_time: formData.tour_time instanceof Date 
        ? formData.tour_time.toISOString()
        : new Date().toISOString(),
      client_name: formData.client_name.trim(),
      property_address: formData.property_address.trim(),
      phone_number: formData.phone_number.trim(),
    };
    console.log('Submitting tour data:', submissionData);
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
                fullWidth
                label="Property Address"
                value={formData.property_address}
                onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Tour Date & Time"
                  value={formData.tour_time}
                  onChange={(newValue) => setFormData({ ...formData, tour_time: newValue })}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
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
                label="Notes"
                multiline
                rows={4}
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