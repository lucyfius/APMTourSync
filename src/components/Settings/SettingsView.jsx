import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import database from '../../utils/database';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    companyName: 'APM',
    businessHours: {
      start: new Date().setHours(9, 0),
      end: new Date().setHours(17, 0)
    },
    notifications: {
      email: true,
      desktop: true
    },
    autoUpdate: true
  });

  const handleChange = (section, field) => (event) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.value
      }
    }));
  };

  const handleToggle = (section, field) => (event) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: event.target.checked
      }
    }));
  };

  const handleSave = async () => {
    try {
      await database.updateSettings(settings);
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Company Information</Typography>
              <TextField
                label="Company Name"
                value={settings.companyName}
                onChange={handleChange('company', 'name')}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>Business Hours</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Start Time"
                    value={settings.businessHours.start}
                    onChange={(newValue) => {
                      handleChange('businessHours', 'start')({ target: { value: newValue } });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="End Time"
                    value={settings.businessHours.end}
                    onChange={(newValue) => {
                      handleChange('businessHours', 'end')({ target: { value: newValue } });
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.email}
                    onChange={handleToggle('notifications', 'email')}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications.desktop}
                    onChange={handleToggle('notifications', 'desktop')}
                  />
                }
                label="Desktop Notifications"
              />
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>System</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoUpdate}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      autoUpdate: e.target.checked
                    }))}
                  />
                }
                label="Automatic Updates"
              />
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" onClick={handleSave}>
                  Save Settings
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
} 