import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DonorManagement from "./components/DonorManagement";
import CampaignTracking from './components/CampaignTracking'
import ImpactDashboard from "./components/ImpactDashbaord";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button color="inherit" component={Link} to="/">
                            Donor Management
                        </Button>
                        <Button color="inherit" component={Link} to="/campaigns">
                            Campaigns
                        </Button>
                        <Button color="inherit" component={Link} to="/impact">
                            Impact Dashboard
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<DonorManagement />} />
                <Route path="/campaigns" element={<CampaignTracking />} />
                <Route path="/impact" element={<ImpactDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
