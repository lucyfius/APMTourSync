import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import database from '../../utils/database';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    company: {
      name: 'APM',
      email: 'contact@apm.com',
      phone: '',
      address: ''
    },
    tours: {
      defaultDuration: 30,
      minimumNotice: 24,
      businessHours: {
        start: new Date().setHours(9, 0),
        end: new Date().setHours(17, 0)
      },
      allowWeekends: false
    },
    notifications: {
      email: true,
      desktop: true,
      reminderTime: 24 // hours before tour
    },
    application: {
      requireAllDocuments: true,
      autoRejectIncomplete: false,
      documentExpiryDays: 30
    },
    system: {
      autoUpdate: true,
      darkMode: false,
      language: 'en'
    }
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem('settings') || 'null');
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleChange = (section, field) => (event) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value
      }
    }));
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('settings', JSON.stringify(settings));
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error saving settings',
        severity: 'error'
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Settings</Typography>
        
        <Grid container spacing={3}>
          {/* Company Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={settings.company.name}
                    onChange={handleChange('company', 'name')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Company Email"
                    value={settings.company.email}
                    onChange={handleChange('company', 'email')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={settings.company.phone}
                    onChange={handleChange('company', 'phone')}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={settings.company.address}
                    onChange={handleChange('company', 'address')}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Tour Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Tour Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Default Tour Duration</InputLabel>
                    <Select
                      value={settings.tours.defaultDuration}
                      onChange={handleChange('tours', 'defaultDuration')}
                      label="Default Tour Duration"
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={45}>45 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.tours.allowWeekends}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          tours: {
                            ...prev.tours,
                            allowWeekends: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Allow Weekend Tours"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Application Settings */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Application Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.application.requireAllDocuments}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          application: {
                            ...prev.application,
                            requireAllDocuments: e.target.checked
                          }
                        }))}
                      />
                    }
                    label="Require All Documents"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Document Expiry (Days)"
                    value={settings.application.documentExpiryDays}
                    onChange={handleChange('application', 'documentExpiryDays')}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            size="large"
          >
            Save Settings
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
} 