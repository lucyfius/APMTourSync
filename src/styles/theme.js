import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8B1F2F', // Burgundy
      light: '#A62639',
      dark: '#6B1825',
    },
    secondary: {
      main: '#455A64',
      light: '#607D8B',
      dark: '#37474F',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#4A4A4A',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2C2C2C',
          color: '#E8E8E8',
        },
      },
    },
  },
});

export default theme; 