import React from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MinimizeIcon from '@mui/icons-material/Minimize';
import CropSquareIcon from '@mui/icons-material/CropSquare';

function TitleBar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: 9999,
        display: 'flex',
        WebkitAppRegion: 'no-drag',
        backgroundColor: 'transparent',
        '& .MuiIconButton-root': {
          borderRadius: 0,
          padding: '4px 12px',
          height: '32px',
          minWidth: '46px',
          transition: 'all 0.2s',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.2rem',
          }
        },
        '& .MuiIconButton-root:last-child': {
          '&:hover': {
            backgroundColor: '#e81123',
            '& .MuiSvgIcon-root': {
              color: 'white'
            }
          }
        }
      }}
    >
      <IconButton
        onClick={() => window.api.app.minimize()}
        size="small"
        sx={{ 
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <MinimizeIcon />
      </IconButton>
      <IconButton
        onClick={() => window.api.app.maximize()}
        size="small"
        sx={{ 
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <CropSquareIcon />
      </IconButton>
      <IconButton
        onClick={() => window.api.app.close()}
        size="small"
        sx={{ 
          color: 'text.primary'
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

export default TitleBar; 