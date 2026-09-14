import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#334155',
      light: '#E2E8F0',
      dark: '#0F172A',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748B',
      light: '#E2E8F0',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#A16207',
      light: '#FEF3C7',
    },
    error: {
      main: '#B91C1C',
      light: '#FEE2E2',
    },
    info: {
      main: '#0369A1',
      light: '#E0F2FE',
    },
    background: {
      default: '#FFFFFF',
      paper: '#ffffff',
    },
    text: {
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", sans-serif',
    h3: { fontWeight: 700, lineHeight: 1.1 },
    h4: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 20, boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: '#ffffff', color: '#0f172a', borderBottom: '1px solid #e2e8f0' },
      },
    },
  },
});
