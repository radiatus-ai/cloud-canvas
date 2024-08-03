import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Keep the existing primary color
    },
    secondary: {
      main: '#dc004e', // Keep the existing secondary color
    },
    background: {
      default: '#f5f5f5', // Light gray background to match the screenshot
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 500 },
    h2: { fontSize: '1.25rem', fontWeight: 500 },
    h3: { fontSize: '1.1rem', fontWeight: 500 },
    h4: { fontSize: '1rem', fontWeight: 500 },
    h5: { fontSize: '0.9rem', fontWeight: 500 },
    h6: { fontSize: '0.875rem', fontWeight: 500 },
  },
  spacing: 8, // Revert to default spacing
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Removes all-caps from buttons
          fontWeight: 400,
          fontSize: '0.875rem',
          padding: '6px 16px',
        },
        sizeSmall: {
          fontSize: '0.8125rem',
          padding: '4px 10px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        },
        head: {
          fontWeight: 500,
          color: 'rgba(0, 0, 0, 0.87)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
          },
        },
      },
    },
  },
});

export default theme;
