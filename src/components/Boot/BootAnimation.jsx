import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

const gradientShift = keyframes`
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
`;

export default function BootAnimation({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setShowLogo(true);
      await new Promise(r => setTimeout(r, 800));
      setShowText(true);
      await new Promise(r => setTimeout(r, 600));
      setShowSubtext(true);
      await new Promise(r => setTimeout(r, 1200));
      onComplete();
    };
    
    sequence();
  }, [onComplete]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Fade in={showLogo} timeout={1000}>
        <Box
          component="img"
          src="../assets/icons/logo.png"
          sx={{
            width: 240,
            height: 'auto',
            mb: 4,
            filter: 'drop-shadow(0 0 12px rgba(139, 31, 47, 0.35))'
          }}
        />
      </Fade>
      
      <Fade in={showText} timeout={800}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '3rem',
            background: 'linear-gradient(90deg, #8B1F2F, #A62639, #6B1825, #455A64, #8B1F2F)',
            backgroundSize: '200% 100%',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1.5,
            animation: `${gradientShift} 2s linear infinite`
          }}
        >
          TourSync
        </Typography>
      </Fade>
      
      <Fade in={showSubtext} timeout={800}>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ 
            fontSize: '1.25rem'
          }}
        >
          An Internal Tool for Affordable Property Management
        </Typography>
      </Fade>
    </Box>
  );
} 