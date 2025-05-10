import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4361ee',
            light: '#eef2ff',
            dark: '#3a56d5'
        },
        secondary: {
            main: '#3f37c9',
            contrastText: '#ffffff'
        },
        success: {
            main: '#4cc9f0',
            light: '#f0f9ff'
        },
        error: {
            main: '#f72585',
            light: '#fef1f7'
        },
        background: {
            default: '#f8fafc',
            paper: '#ffffff'
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b'
        }
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 20px'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.1)'
                    }
                }
            }
        }
    }
});

export default theme;