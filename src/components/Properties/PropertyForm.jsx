import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  InputAdornment
} from '@mui/material';
import database from '../../utils/database';

const PROPERTY_TYPES = ['house', 'apartment', 'duplex', 'townhouse', 'commercial'];

export default function PropertyForm({ open, onClose, property, onSubmit }) {
  const [formData, setFormData] = useState({
    address: '',
    type: 'house',
    bedrooms: 1,
    bathrooms: 1,
    rent_price: '',
    description: ''
  });

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        rent_price: property.rent_price ? property.rent_price.toString() : ''
      });
    } else {
      setFormData({
        address: '',
        type: 'house',
        bedrooms: 1,
        bathrooms: 1,
        rent_price: '',
        description: ''
      });
    }
  }, [property]);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Reset bedrooms and bathrooms if commercial
      bedrooms: newType === 'commercial' ? 0 : prev.bedrooms,
      bathrooms: newType === 'commercial' ? 0 : prev.bathrooms
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      rent_price: parseFloat(formData.rent_price) || 0,
    };

    // Only include bedrooms and bathrooms for non-commercial properties
    if (formData.type !== 'commercial') {
      submitData.bedrooms = parseInt(formData.bedrooms) || 0;
      submitData.bathrooms = parseInt(formData.bathrooms) || 0;
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{property ? 'Edit Property' : 'New Property'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Property Type"
                value={formData.type}
                onChange={handleTypeChange}
                required
              >
                {PROPERTY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {formData.type !== 'commercial' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bedrooms"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Bathrooms"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    required
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Monthly Rent"
                value={formData.rent_price}
                onChange={(e) => setFormData({ ...formData, rent_price: e.target.value })}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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