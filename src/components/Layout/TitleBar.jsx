import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';

function TitleBar() {
  return (
    <>
      <Box
        sx={{
          WebkitAppRegion: 'drag',
          bgcolor: 'background.paper',
          height: '33px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={process.env.NODE_ENV === 'development' 
              ? "/assets/icons/logo.png"
              : "../../assets/icons/logo.png"} 
            alt="TourSync" 
            style={{ height: '28px' }} 
          />
        </Box>

        <Box
          sx={{
            WebkitAppRegion: 'no-drag',
            display: 'flex',
            gap: 0.5
          }}
        >
          <IconButton
            onClick={() => window.api.app.minimize()}
            size="small"
            sx={{ 
              padding: '4px',
              borderRadius: '4px',
              '& .MuiSvgIcon-root': {
                color: 'text.secondary',
                transition: 'color 0.2s',
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#FFD700'  // Gold color for minimize
              }
            }}
          >
            <MinimizeIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
          
          <IconButton
            onClick={() => window.api.app.maximize()}
            size="small"
            sx={{ 
              padding: '4px',
              borderRadius: '4px',
              '& .MuiSvgIcon-root': {
                color: 'text.secondary',
                transition: 'color 0.2s',
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#00C853'  // Green color for maximize
              }
            }}
          >
            <CropSquareIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
          
          <IconButton
            onClick={() => window.api.app.close()}
            size="small"
            sx={{ 
              padding: '4px',
              borderRadius: '4px',
              '& .MuiSvgIcon-root': {
                color: 'text.secondary',
                transition: 'color 0.2s',
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#FF1744'  // Red color for close
              }
            }}
          >
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

export default TitleBar; 