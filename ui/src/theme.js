import { createTheme } from '@mui/material/styles';

// const lightPrimaryColor = '#1976d2';
const lightPrimaryColor = '#1a37f0';
const darkPrimaryColor = '#FF1493';

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
          fontFamily:
            '"Archivo Black", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        // root: {
        //   color: 'red',
        // },
        h1: {
          fontFamily: '"Anton", "Roboto", "Helvetica", "Arial", sans-serif',
          // color: darkPrimaryColor,
          // slightly brighter pink
          color: '#fc2899',
        },
        h2: {
          fontFamily: '"Anton", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h3: {
          fontFamily:
            '"Archivo Black", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h4: {
          fontFamily:
            '"Archivo Black", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h5: {
          fontFamily:
            '"Archivo Black", "Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: '1.2rem',
        },
      },
    },
  },
});

export const lightTheme = createTheme(baseTheme, {
  palette: {
    mode: 'light',
    primary: {
      main: lightPrimaryColor,
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#F5F5F5',
      paper: '#ffffff',
    },
    // divider: 'rgba(100, 0, 0, 0.12)',
    divider: lightPrimaryColor,
    components: {
      MuiTypography: {
        styleOverrides: {
          // root: {
          //   color: 'red',
          // },
          // these seem to be set in the base / need to be set in the base
          // this doesn't change the color of the text
          // h1: {
          //   color: 'blue',
          //   fontFamily: ' "Helvetica", "Arial", sans-serif',
          // },
        },
      },
    },
  },
});

export const darkTheme = createTheme(baseTheme, {
  palette: {
    mode: 'dark',
    primary: {
      main: darkPrimaryColor,
    },
    secondary: {
      main: '#f48fb1', // Light pink for secondary elements
    },
    text: {
      primary: '#ffffff', // White for primary text
      secondary: '#b0bec5', // Light grey for secondary text
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e', // Slightly lighter than the default background
    },
    // divider: lightPrimaryColor,
  },
  components: {
    // these work as "overrides"
    MuiTypography: {
      styleOverrides: {
        // root: {
        //   color: 'red',
        // },
        h1: {
          color: lightPrimaryColor,
          // slightly brighter blue
          color: '#1487fa',
        },
        // h2: {
        //   color: 'red',
        // },
        // h3: {
        //   color: 'red',
        // },
        // h4: {
        //   color: 'red',
        // },
      },
    },
  },
});
