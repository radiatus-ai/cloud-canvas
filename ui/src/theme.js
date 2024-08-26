import { createTheme } from '@mui/material/styles';

const baseTheme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    // Add more typography variants as needed
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    // Override more component styles here
  },
});

export const lightTheme = createTheme(baseTheme, {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

export const darkTheme = createTheme(baseTheme, {
  palette: {
    mode: 'dark',
    fontFamily: 'Roboto',
    primary: {
      // main: '#90caf9',
    },
    secondary: {
      // main: '#f48fb1',
    },
    background: {
      // default: '#121212',
      // paper: 'rgb(18, 18, 18)',
    },
  },
});