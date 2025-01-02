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
        backgroundColor: 'transparent'
      }}
    >
      <IconButton
        onClick={() => window.api.app.minimize()}
        size="small"
        sx={{ color: 'text.primary' }}
      >
        <MinimizeIcon />
      </IconButton>
      <IconButton
        onClick={() => window.api.app.maximize()}
        size="small"
        sx={{ color: 'text.primary' }}
      >
        <CropSquareIcon />
      </IconButton>
      <IconButton
        onClick={() => window.api.app.close()}
        size="small"
        sx={{ color: 'text.primary' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}

export default TitleBar; 