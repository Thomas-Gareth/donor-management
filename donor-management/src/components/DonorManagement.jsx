import { useEffect, useState } from "react";
import { addDonor, getDonors, deleteDonor } from "../services/DonorService";
import { getCampaigns } from "../services/CampaignService";
import { 
    Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton, Box 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function DonorManagement() {
    const [donors, setDonors] = useState([]);
    const [newDonor, setNewDonor] = useState({ name: "", email: "", phone: "" });

    useEffect(() => {
        fetchDonors();
    }, []);

    const fetchDonors = async () => {
        const data = await getDonors();
        setDonors(data);
    };

    const handleAddDonor = async () => {
        if (!newDonor.name || !newDonor.email || !newDonor.phone) {
            alert("Please fill all fields.");
            return;
        }

        await addDonor({ ...newDonor, totalDonations: 0 });
        setNewDonor({ name: "", email: "", phone: "" });
        fetchDonors();
    };

    const handleDeleteDonor = async (id) => {
        await deleteDonor(id);
        fetchDonors();
    };

    const generateCSVReport = (data, filename = 'donor_report') => {
        // Convert donors to CSV
        const headers = ['Name', 'Email', 'Phone', 'Total Donations'];
        const csvData = data.map(donor => [
            donor.name, 
            donor.email, 
            donor.phone, 
            donor.totalDonations || 0
        ]);

        // Combine headers and data
        const csvContent = [
            headers,
            ...csvData
        ].map(e => e.map(String).map(v => v.replace(/"/g, '""')).map(v => `"${v}"`).join(","))
        .join("\n");

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${filename}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const generatePDFReport = async (filename = 'donor_report') => {
        const campaigns = await getCampaigns();
        
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.text('Donor Comprehensive Report', 14, 22);
        
        // Donor Table
        const donorColumns = ['Name', 'Email', 'Phone', 'Total Donations'];
        const donorRows = donors.map(donor => [
            donor.name, 
            donor.email, 
            donor.phone, 
            `$${donor.totalDonations || 0}`
        ]);

        doc.autoTable({
            startY: 30,
            head: [donorColumns],
            body: donorRows,
            theme: 'striped',
            styles: { 
                fontSize: 10,
                cellPadding: 3 
            },
            headStyles: { 
                fillColor: [22, 118, 210],
                textColor: 255 
            }
        });

        // Campaign Summary
        const campaignSummary = campaigns.map(campaign => [
            campaign.name,
            `$${campaign.goal}`,
            `$${campaign.fundsRaised || 0}`,
            `${((campaign.fundsRaised || 0) / campaign.goal * 100).toFixed(2)}%`
        ]);

        doc.text('Campaign Summary', 14, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
            startY: doc.autoTable.previous.finalY + 20,
            head: ['Campaign', 'Goal', 'Funds Raised', 'Completion %'],
            body: campaignSummary,
            theme: 'striped',
            styles: { 
                fontSize: 10,
                cellPadding: 3 
            },
            headStyles: { 
                fillColor: [22, 118, 210],
                textColor: 255 
            }
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Donor Management
            </Typography>

            {/* Donor Form */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">Add Donor</Typography>
                <TextField 
                    fullWidth 
                    label="Name" 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                    value={newDonor.name} 
                    onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })} 
                />
                <TextField 
                    fullWidth 
                    label="Email" 
                    type="email" 
                    variant="outlined" 
                    sx={{ mt: 2 }} 
                    value={newDonor.email} 
                    onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })} 
                />
                <TextField 
                    fullWidth 
                    label="Phone" 
                    variant="outlined" 
                    sx={{ mt: 2, mb: 2 }} 
                    value={newDonor.phone} 
                    onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })} 
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleAddDonor}>
                    Add Donor
                </Button>
            </Paper>

            {/* Donor List */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Email</b></TableCell>
                            <TableCell><b>Phone</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {donors.map((donor) => (
                            <TableRow key={donor.id}>
                                <TableCell>{donor.name}</TableCell>
                                <TableCell>{donor.email}</TableCell>
                                <TableCell>{donor.phone}</TableCell>
                                <TableCell>
                                    <IconButton color="error" onClick={() => handleDeleteDonor(donor.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Report Generation Buttons */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => generateCSVReport(donors)}
                >
                    Generate CSV Report
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={() => generatePDFReport()}
                >
                    Generate PDF Report
                </Button>
            </Box>
        </Container>
    );
}

export default DonorManagement;