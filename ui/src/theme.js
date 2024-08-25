import { createTheme } from '@mui/material/styles';

const baseTheme = {
  typography: {
    // fontSize: 14,
    // fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // h1: { fontSize: '1.5rem', fontWeight: 500 },
    // h2: { fontSize: '1.25rem', fontWeight: 500 },
    // h3: { fontSize: '1.1rem', fontWeight: 500 },
    // h4: { fontSize: '1rem', fontWeight: 500 },
    // h5: { fontSize: '0.9rem', fontWeight: 500 },
    // h6: { fontSize: '0.875rem', fontWeight: 500 },
  },
  // spacing: 8,
  components: {
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none',
    //       fontWeight: 400,
    //       fontSize: '0.875rem',
    //       padding: '6px 16px',
    //     },
    //     sizeSmall: {
    //       fontSize: '0.8125rem',
    //       padding: '4px 10px',
    //     },
    //   },
    // },
    // MuiTableCell: {
    //   styleOverrides: {
    //     root: {
    //       padding: '16px',
    //     },
    //     head: {
    //       fontWeight: 500,
    //     },
    //   },
    // },
    // MuiTableRow: {
    //   styleOverrides: {
    //     root: {
    //       '&:hover': {
    //         backgroundColor: 'rgba(0, 0, 0, 0.04)',
    //       },
    //     },
    //   },
    // },
    // MuiCard: {
    //   styleOverrides: {
    //     root: {
    //       boxShadow: 'none',
    //     },
    //   },
    // },
    // MuiCardContent: {
    //   styleOverrides: {
    //     root: {
    //       padding: '16px',
    //       '&:last-child': {
    //         paddingBottom: '16px',
    //       },
    //     },
    //   },
    // },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiOutlinedInput-root': {
    //         '&:hover fieldset': {
    //           borderColor: 'rgba(0, 0, 0, 0.87)',
    //         },
    //       },
    //     },
    //   },
    // },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
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

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});
