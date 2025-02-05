import { useEffect, useState } from "react";
import { addCampaign, getCampaigns, deleteCampaign } from "../services/CampaignService";
import { 
    Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function CampaignTracking() {
    const [campaigns, setCampaigns] = useState([]);
    const [newCampaign, setNewCampaign] = useState({ name: "", goal: "", description: "" });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        const data = await getCampaigns();
        setCampaigns(data);
    };

    const handleAddCampaign = async () => {
        if (!newCampaign.name || !newCampaign.goal || !newCampaign.description) {
            alert("Please fill all fields.");
            return;
        }

        await addCampaign({ ...newCampaign, goal: parseFloat(newCampaign.goal), fundsRaised: 0 });
        setNewCampaign({ name: "", goal: "", description: "" });
        fetchCampaigns();
    };

    const handleDeleteCampaign = async (id) => {
        await deleteCampaign(id);
        fetchCampaigns();
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Fundraising Campaigns
            </Typography>

            {/* Campaign Form */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">Create Campaign</Typography>
                <TextField 
                    fullWidth 
                    label="Campaign Name" 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                    value={newCampaign.name} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })} 
                />
                <TextField 
                    fullWidth 
                    label="Goal Amount ($)" 
                    type="number" 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                    value={newCampaign.goal} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })} 
                />
                <TextField 
                    fullWidth 
                    label="Description" 
                    multiline 
                    rows={3} 
                    variant="outlined" 
                    sx={{ mt: 2, mb: 2 }} 
                    value={newCampaign.description} 
                    onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })} 
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleAddCampaign}>
                    Create Campaign
                </Button>
            </Paper>

            {/* Campaign List */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Goal ($)</b></TableCell>
                            <TableCell><b>Funds Raised</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns.map((campaign) => (
                            <TableRow key={campaign.id}>
                                <TableCell>{campaign.name}</TableCell>
                                <TableCell>${campaign.goal}</TableCell>
                                <TableCell>${campaign.fundsRaised}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDeleteCampaign(campaign.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default CampaignTracking;
