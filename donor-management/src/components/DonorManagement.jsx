import { useEffect, useState } from "react";
import { addDonor, getDonors, deleteDonor } from "../services/DonorService";
import { 
    Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, IconButton 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
        </Container>
    );
}

export default DonorManagement;
