import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Box, Alert, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';

import Sidebar from './components/Layout/Sidebar';
import DashboardView from './components/Dashboard/DashboardView';
import TourList from './components/Tours/TourList';
import PropertyList from './components/Properties/PropertyList';
import TitleBar from './components/Layout/TitleBar';
import BootAnimation from './components/Boot/BootAnimation';
import ReportsView from './components/Reports/ReportsView';
import ApplicationRequestView from './components/ApplicationRequest/ApplicationRequestView';
import SettingsView from './components/Settings/SettingsView';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Testing database connection...');
        const tours = await window.api.database.getTours();
        console.log('Database connection successful:', tours);
        setLoading(false);
      } catch (err) {
        console.error('Database connection error:', err);
        setError(err.message || 'Failed to connect to database');
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry Connection
        </Button>
      </Box>
    );
  }

  if (showBoot) {
    return <BootAnimation onComplete={() => setShowBoot(false)} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column', mt: '28px' }}>
          <TitleBar />
          <Box sx={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<DashboardView />} />
                <Route path="/tours" element={<TourList />} />
                <Route path="/properties" element={<PropertyList />} />
                <Route path="/reports" element={<ReportsView />} />
                <Route path="/settings" element={<SettingsView />} />
                <Route path="/application-request" element={<ApplicationRequestView />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App; 