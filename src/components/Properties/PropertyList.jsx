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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PropertyForm from './PropertyForm';
import database from '../../utils/database';
import { useNavigate } from 'react-router-dom';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import ReportGenerator from '../Reports/ReportGenerator';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyForReport, setSelectedPropertyForReport] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [propertyForReport, setPropertyForReport] = useState(null);

  const navigate = useNavigate();

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

  const handleReportClick = (property) => {
    setPropertyForReport(property);
    setReportDialogOpen(true);
  };

  const generateReport = async (property) => {
    try {
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
      const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
      
      const tours = await window.api.database.getTours();
      
      const propertyTours = tours.filter(tour => {
        const tourDate = new Date(tour.tour_time);
        return (
          tour.property_id === property._id &&
          tourDate >= weekStart &&
          tourDate <= weekEnd
        );
      });

      const stats = {
        total: propertyTours.length,
        completed: propertyTours.filter(t => t.status === 'completed').length,
        cancelled: propertyTours.filter(t => t.status === 'cancelled').length,
        noShow: propertyTours.filter(t => t.status === 'no-show').length,
        scheduled: propertyTours.filter(t => t.status === 'scheduled').length
      };

      const formattedTours = propertyTours.map(tour => ({
        date: format(new Date(tour.tour_time), 'PPp'),
        status: tour.status || 'scheduled'
      }));

      const report = {
        id: Date.now(),
        property,
        weekRange: {
          start: format(weekStart, 'PP'),
          end: format(weekEnd, 'PP')
        },
        stats,
        tours: formattedTours,
        generatedAt: new Date().toISOString()
      };

      // Store report in localStorage
      const existingReports = JSON.parse(localStorage.getItem('reports') || '[]');
      localStorage.setItem('reports', JSON.stringify([...existingReports, report]));

      // Navigate to reports tab
      navigate('/reports');
    } catch (error) {
      console.error('Error generating report:', error);
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
                <Button 
                  size="small" 
                  onClick={() => handleReportClick(property)}
                >
                  Generate Report
                </Button>
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

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate Tour Report</DialogTitle>
        <DialogContent>
          {propertyForReport && (
            <ReportGenerator 
              property={propertyForReport}
              onReportGenerated={() => {
                setReportDialogOpen(false);
                navigate('/reports');
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 