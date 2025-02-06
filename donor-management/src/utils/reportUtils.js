import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateCSV = (data, filename) => {
    // Convert data to CSV format
    const csvContent = [];
    
    // Add headers
    const headers = Object.keys(data[0]);
    csvContent.push(headers.join(','));
    
    // Add data rows
    data.forEach(item => {
        const row = headers.map(header => {
            const value = item[header];
            // Handle values that might contain commas
            return typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value;
        });
        csvContent.push(row.join(','));
    });
    
    // Create and download CSV file
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const generateDonorReport = async (donors, campaigns, timeRange) => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();
    
    // Title and Header
    doc.setFontSize(20);
    doc.text('Donor Impact Report', 15, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 15, 30);
    doc.text(`Time Period: ${timeRange}`, 15, 40);
    
    // Summary Statistics
    doc.setFontSize(16);
    doc.text('Summary Statistics', 15, 60);
    doc.setFontSize(12);
    const totalDonations = donors.reduce((sum, donor) => sum + (donor.totalDonations || 0), 0);
    const avgDonation = totalDonations / donors.length || 0;
    
    const summaryData = [
        ['Total Donors:', donors.length],
        ['Total Donations:', `$${totalDonations.toLocaleString()}`],
        ['Average Donation:', `$${avgDonation.toLocaleString()}`],
        ['Active Campaigns:', campaigns.length]
    ];
    
    doc.autoTable({
        startY: 70,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10 }
    });
    
    // Top Donors Table
    doc.setFontSize(16);
    doc.text('Top Donors', 15, doc.autoTable.previous.finalY + 20);
    
    const topDonorsData = donors
        .sort((a, b) => (b.totalDonations || 0) - (a.totalDonations || 0))
        .slice(0, 5)
        .map(donor => [
            donor.name,
            donor.email,
            `$${(donor.totalDonations || 0).toLocaleString()}`
        ]);
    
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 30,
        head: [['Name', 'Email', 'Total Donations']],
        body: topDonorsData,
        theme: 'grid',
        styles: { fontSize: 10 }
    });
    
    // Campaign Performance
    doc.setFontSize(16);
    doc.text('Campaign Performance', 15, doc.autoTable.previous.finalY + 20);
    
    const campaignData = campaigns.map(campaign => [
        campaign.name,
        `$${campaign.goal.toLocaleString()}`,
        `$${(campaign.fundsRaised || 0).toLocaleString()}`,
        `${((campaign.fundsRaised || 0) / campaign.goal * 100).toFixed(1)}%`
    ]);
    
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 30,
        head: [['Campaign Name', 'Goal', 'Funds Raised', 'Progress']],
        body: campaignData,
        theme: 'grid',
        styles: { fontSize: 10 }
    });
    
    // Save the PDF
    doc.save('donor-impact-report.pdf');
};