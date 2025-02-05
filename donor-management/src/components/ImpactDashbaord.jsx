import React, { useEffect, useState } from 'react';
import { getCampaigns } from '../services/CampaignService';
import { getDonors } from '../services/DonorService';
import { 
    Container, Grid, Paper, Typography, Box, LinearProgress,
    Card, CardContent, CardHeader, FormControl, Select, MenuItem,
    InputLabel
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
    const [timeFilter, setTimeFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState(new Date().getMonth());
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        fetchData();
    }, [timeFilter, yearFilter, monthFilter]);

    const fetchData = async () => {
        const campaigns = await getCampaigns();
        const donors = await getDonors();
        
        const filteredCampaigns = filterDataByTime(campaigns);
        const filteredDonors = filterDataByTime(donors);
        
        const totalFunds = filteredCampaigns.reduce((sum, campaign) => 
            sum + (campaign.fundsRaised || 0), 0);
        
        setMetrics({
            totalDonors: filteredDonors.length,
            totalFunds: totalFunds,
            activeCampaigns: filteredCampaigns.length,
            avgDonation: filteredDonors.length ? (totalFunds / filteredDonors.length).toFixed(2) : 0
        });

        setCampaignProgress(filteredCampaigns.map(campaign => ({
            name: campaign.name,
            raised: campaign.fundsRaised || 0,
            goal: campaign.goal,
            progress: ((campaign.fundsRaised || 0) / campaign.goal * 100).toFixed(1)
        })));

        const years = [...new Set(campaigns.map(campaign => 
            new Date(campaign.createdAt).getFullYear()
        ))].sort((a, b) => b - a);
        setAvailableYears(years);
    };

    const filterDataByTime = (data) => {
        return data.filter(item => {
            const date = new Date(item.createdAt);
            const itemYear = date.getFullYear();
            const itemMonth = date.getMonth();

            switch (timeFilter) {
                case 'month':
                    return itemYear === yearFilter && itemMonth === monthFilter;
                case 'year':
                    return itemYear === yearFilter;
                default:
                    return true;
            }
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Impact Dashboard</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>Time Period</InputLabel>
                        <Select
                            value={timeFilter}
                            label="Time Period"
                            onChange={(e) => setTimeFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Time</MenuItem>
                            <MenuItem value="year">Yearly</MenuItem>
                            <MenuItem value="month">Monthly</MenuItem>
                        </Select>
                    </FormControl>

                    {timeFilter !== 'all' && (
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={yearFilter}
                                label="Year"
                                onChange={(e) => setYearFilter(e.target.value)}
                            >
                                {availableYears.map(year => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {timeFilter === 'month' && (
                        <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={monthFilter}
                                label="Month"
                                onChange={(e) => setMonthFilter(e.target.value)}
                            >
                                {monthNames.map((month, index) => (
                                    <MenuItem key={index} value={index}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>
            </Box>
            
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