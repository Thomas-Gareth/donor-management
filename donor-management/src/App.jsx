import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DonorManagement from "./components/DonorManagement";
import CampaignTracking from './components/CampaignTracking'
import { AppBar, Toolbar, Button } from "@mui/material";

function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/">Donor Management</Button>
                    <Button color="inherit" component={Link} to="/campaigns">Campaigns</Button>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/" element={<DonorManagement />} />
                <Route path="/campaigns" element={<CampaignTracking />} />
            </Routes>
        </Router>
    );
}

export default App;
