import React, { useState } from 'react';
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
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { toPng } from 'html-to-image';
import SaveIcon from '@mui/icons-material/Save';

export default function ReportGenerator({ property, onReportGenerated }) {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [weekType, setWeekType] = useState('lastWeek'); // 'lastWeek' or 'currentWeek'

  const generateReport = async () => {
    setLoading(true);
    try {
      let weekStart, weekEnd;
      
      if (weekType === 'lastWeek') {
        // Get last week's date range
        weekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
        weekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
      } else {
        // Get current week's date range
        weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
        weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
      }

      // Fetch tours for this property within the date range
      const tours = await window.api.database.getTours();
      
      // Filter tours for this property and date range
      const propertyTours = tours.filter(tour => {
        const tourDate = new Date(tour.tour_time);
        return (
          tour.property_id === property._id &&
          tourDate >= weekStart &&
          tourDate <= weekEnd
        );
      });

      // Calculate statistics
      const stats = {
        total: propertyTours.length,
        completed: propertyTours.filter(t => t.status === 'completed').length,
        cancelled: propertyTours.filter(t => t.status === 'cancelled').length,
        noShow: propertyTours.filter(t => t.status === 'no-show').length,
        scheduled: propertyTours.filter(t => t.status === 'scheduled').length
      };

      // Format tours for display (excluding sensitive info)
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

      if (onReportGenerated) {
        onReportGenerated();
      }

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async () => {
    try {
      const element = document.getElementById('report-container');
      const dataUrl = await toPng(element);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.download = `tour-report-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  return (
    <Box>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <RadioGroup
          row
          value={weekType}
          onChange={(e) => setWeekType(e.target.value)}
        >
          <FormControlLabel 
            value="lastWeek" 
            control={<Radio />} 
            label="Last Week" 
          />
          <FormControlLabel 
            value="currentWeek" 
            control={<Radio />} 
            label="Current Week" 
          />
        </RadioGroup>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Weekly Report'}
        </Button>
        {reportData && (
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={saveReport}
          >
            Save as Image
          </Button>
        )}
      </Box>

      {reportData && (
        <Paper sx={{ p: 3, mt: 2 }} id="report-container">
          <Typography variant="h6" gutterBottom>
            Tour Report: {reportData.propertyAddress}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Week of {reportData.weekRange.start} - {reportData.weekRange.end}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Total Tours</TableCell>
                    <TableCell>{reportData.stats.total}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Completed</TableCell>
                    <TableCell>{reportData.stats.completed}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cancelled</TableCell>
                    <TableCell>{reportData.stats.cancelled}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>No Shows</TableCell>
                    <TableCell>{reportData.stats.noShow}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Scheduled</TableCell>
                    <TableCell>{reportData.stats.scheduled}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Tour Schedule</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date & Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.tours.map((tour, index) => (
                    <TableRow key={index}>
                      <TableCell>{tour.date}</TableCell>
                      <TableCell>{tour.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      )}
    </Box>
  );
} 