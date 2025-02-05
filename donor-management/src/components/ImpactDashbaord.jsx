import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/CampaignService';
import { getDonors } from '../services/DonorService';
import { 
    Container, Grid, Paper, Typography, Box, LinearProgress,
    Card, CardContent, CardHeader
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ImpactDashboard() {
    const [metrics, setMetrics] = useState({
        totalDonors: 0,
        totalFunds: 0,
        activeCampaigns: 0,
        avgDonation: 0
    });
    const [campaignProgress, setCampaignProgress] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const campaigns = await getCampaigns();
        const donors = await getDonors();
        
        const totalFunds = campaigns.reduce((sum, campaign) => 
            sum + (campaign.fundsRaised || 0), 0);
        
        setMetrics({
            totalDonors: donors.length,
            totalFunds: totalFunds,
            activeCampaigns: campaigns.length,
            avgDonation: donors.length ? (totalFunds / donors.length).toFixed(2) : 0
        });

        setCampaignProgress(campaigns.map(campaign => ({
            name: campaign.name,
            raised: campaign.fundsRaised || 0,
            goal: campaign.goal,
            progress: ((campaign.fundsRaised || 0) / campaign.goal * 100).toFixed(1)
        })));
    };

    const MetricCard = ({ title, value }) => (
        <Paper elevation={2} sx={{ height: '100%' }}>
            <CardContent>
                <Typography color="textSecondary" gutterBottom variant="subtitle2">
                    {title}
                </Typography>
                <Typography variant="h4" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Impact Dashboard
            </Typography>
            
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                        title="Total Donors"
                        value={metrics.totalDonors}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                        title="Total Funds Raised"
                        value={`$${metrics.totalFunds.toLocaleString()}`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                        title="Active Campaigns"
                        value={metrics.activeCampaigns}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <MetricCard 
                        title="Average Donation"
                        value={`$${Number(metrics.avgDonation).toLocaleString()}`}
                    />
                </Grid>
            </Grid>

            {/* Campaign Progress Chart */}
            <Paper sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Campaign Progress
                </Typography>
                <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={campaignProgress}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="raised" fill="#1976d2" name="Funds Raised" />
                            <Bar dataKey="goal" fill="#e0e0e0" name="Goal" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>

            {/* Campaign Details */}
            <Grid container spacing={3}>
                {campaignProgress.map((campaign) => (
                    <Grid item xs={12} md={6} key={campaign.name}>
                        <Card>
                            <CardHeader 
                                title={
                                    <Typography variant="h6">
                                        {campaign.name}
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            Progress
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {campaign.progress}%
                                        </Typography>
                                    </Box>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={Math.min(100, parseFloat(campaign.progress))}
                                        sx={{ height: 8, borderRadius: 5 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            ${campaign.raised.toLocaleString()} raised
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Goal: ${campaign.goal.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default ImpactDashboard;