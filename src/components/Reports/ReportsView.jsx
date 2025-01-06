import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';

export default function ReportsView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weekType, setWeekType] = useState('currentWeek');
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('reports') || '[]');
    setReports(savedReports);
  }, []);

  const handleDelete = (reportId) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
  };

  const handleDownload = async (report) => {
    try {
      const element = document.getElementById(`report-${report.id}`);
      const dataUrl = await toPng(element);
      const link = document.createElement('a');
      link.download = `tour-report-${format(new Date(), 'yyyy-MM-dd')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>Reports</Typography>

      {reports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            No Reports Generated
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            To generate a report, please visit the Properties page and select a property to generate a report for.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/properties')}
          >
            Go to Properties
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {reports.map((report) => (
            <Grid item xs={12} key={report.id}>
              <Paper sx={{ p: 3 }} id={`report-${report.id}`}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    Tour Report: {report.property.address}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleDownload(report)}>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(report.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Week of {report.weekRange.start} - {report.weekRange.end}
                </Typography>

                <TableContainer sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Tours</TableCell>
                        <TableCell>{report.stats.total}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Completed</TableCell>
                        <TableCell>{report.stats.completed}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cancelled</TableCell>
                        <TableCell>{report.stats.cancelled}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>No Shows</TableCell>
                        <TableCell>{report.stats.noShow}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Scheduled</TableCell>
                        <TableCell>{report.stats.scheduled}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {report.tours.length > 0 && (
                  <Box>
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
                          {report.tours.map((tour, index) => (
                            <TableRow key={index}>
                              <TableCell>{tour.date}</TableCell>
                              <TableCell>{tour.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
} 