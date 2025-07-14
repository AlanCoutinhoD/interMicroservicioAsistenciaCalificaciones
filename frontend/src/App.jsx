import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Paper
} from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'

// Importar el componente principal
import ListasAsistenciaTutorados from './components/ListasAsistenciaTutorados'

// Tema personalizado con colores universitarios
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      50: '#e3f2fd'
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      50: '#f3e5f5'
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      50: '#e8f5e8'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      50: '#fff3e0'
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
      50: '#ffebee'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      50: '#e1f5fe'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500
        },
        contained: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box sx={{ 
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}>
          {/* Header de la aplicación */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              backgroundColor: 'primary.main',
              borderBottom: '1px solid rgba(255,255,255,0.12)'
            }}
          >
            <Toolbar sx={{ py: 1 }}>
              <SchoolIcon sx={{ mr: 2, fontSize: 28 }} />
              <Typography 
                variant="h5" 
                component="h1" 
                sx={{ 
                  flexGrow: 1,
                  fontWeight: 600,
                  letterSpacing: '-0.02em'
                }}
              >
                Sistema de Asistencia y Calificaciones
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.9,
                  fontWeight: 500
                }}
              >
                Tutorados Académicos
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Contenido principal */}
          <Container 
            maxWidth="xl" 
            sx={{ 
              py: 4,
              px: { xs: 2, sm: 3, md: 4 }
            }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                backgroundColor: 'background.paper',
                border: '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <ListasAsistenciaTutorados />
            </Paper>
          </Container>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              mt: 'auto',
              py: 3,
              backgroundColor: 'primary.dark',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              © 2024 Sistema de Asistencia y Calificaciones - Universidad
            </Typography>
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
