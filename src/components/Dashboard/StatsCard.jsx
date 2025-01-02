import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

export default function StatsCard({ title, value, color = 'primary' }) {
  return (
    <Paper 
      sx={{ 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: 3,
        borderColor: `${color}.main`
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </Paper>
  );
} 