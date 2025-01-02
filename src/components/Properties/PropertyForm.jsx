import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import database from '../../utils/database';

const PROPERTY_TYPES = ['House', 'Apartment', 'Condo', 'Townhouse'];

export default function PropertyForm({ open, onClose, property, onSubmit }) {
  const [formData, setFormData] = useState({
    address: '',
    type: 'House',
    price: '',
    bedrooms: '',
    bathrooms: '',
    description: ''
  });

  useEffect(() => {
    if (property) {
      setFormData(property);
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (property) {
        await database.updateProperty(property._id, formData);
      } else {
        await database.createProperty(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {property ? 'Edit Property' : 'Add New Property'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="type"
              label="Property Type"
              select
              value={formData.type}
              onChange={handleChange}
              fullWidth
              required
            >
              {PROPERTY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="bedrooms"
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="bathrooms"
              label="Bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {property ? 'Save Changes' : 'Add Property'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 