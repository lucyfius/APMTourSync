import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropertyForm from './PropertyForm';
import database from '../../utils/database';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = async () => {
    try {
      const data = await database.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setOpenForm(true);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await database.deleteProperty(propertyId);
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Properties</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add Property
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {property.address}
                </Typography>
                <Typography color="textSecondary">
                  {property.type === 'commercial' ? 'Commercial' : property.type} • ${property.rent_price ? property.rent_price.toLocaleString() : '0'}/month
                </Typography>
                {property.type !== 'commercial' && (
                  <Typography>
                    {property.bedrooms} beds • {property.bathrooms} baths
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  {property.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(property)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(property._id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <PropertyForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedProperty(null);
        }}
        property={selectedProperty}
        onSubmit={async (propertyData) => {
          try {
            if (selectedProperty) {
              await database.updateProperty(selectedProperty._id, propertyData);
            } else {
              await database.createProperty(propertyData);
            }
            fetchProperties();
            setOpenForm(false);
            setSelectedProperty(null);
          } catch (error) {
            console.error('Error saving property:', error);
          }
        }}
      />
    </Box>
  );
} 