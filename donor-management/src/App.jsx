import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import DonorManagement from "./components/DonorManagement";
import CampaignTracking from './components/CampaignTracking';
import ImpactDashboard from './components/ImpactDashbaord';
import { 
  AppBar, Toolbar, Button, Box, Container, Typography,
  Drawer, List, ListItem, ListItemText, ListItemIcon,
  useTheme, ThemeProvider, createTheme
} from "@mui/material";
import { 
  Users, Target, LineChart, ChevronRight 
} from 'lucide-react';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
      },
    },
  },
});

const DRAWER_WIDTH = 280;

const NavigationItem = ({ to, icon: Icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <ListItem 
      component={Link} 
      to={to}
      sx={{
        mb: 1,
        borderRadius: 2,
        bgcolor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'white' : 'text.primary',
        '&:hover': {
          bgcolor: isActive ? 'primary.dark' : 'action.hover',
        },
      }}
    >
      <ListItemIcon sx={{ color: isActive ? 'white' : 'text.primary' }}>
        <Icon size={20} />
      </ListItemIcon>
      <ListItemText 
        primary={text}
        primaryTypographyProps={{
          fontSize: '0.95rem',
          fontWeight: isActive ? 600 : 500,
        }}
      />
      {isActive && (
        <ChevronRight size={20} />
      )}
    </ListItem>
  );
};

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: 'background.paper',
            p: 2,
          },
        }}
      >
        <Box sx={{ mb: 4, px: 2 }}>
          <Typography variant="h6" color="primary">
            Donor Management
          </Typography>
        </Box>
        <List sx={{ px: 1 }}>
          <NavigationItem to="/" icon={Users} text="Donors" />
          <NavigationItem to="/campaigns" icon={Target} text="Campaigns" />
          <NavigationItem to="/impact" icon={LineChart} text="Impact Dashboard" />
        </List>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 4,
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<DonorManagement />} />
            <Route path="/campaigns" element={<CampaignTracking />} />
            <Route path="/impact" element={<ImpactDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;