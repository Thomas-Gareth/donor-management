import { useState, useEffect } from "react";
import { getTotalDonations, getCampaignDonations, getRecentDonations } from "../services/AnalyticsService";
import { Bar, Line, Pie } from "react-chartjs-2";

const ImpactDashboard = () => {
  const [totalDonations, setTotalDonations] = useState(0);
  const [donorCount, setDonorCount] = useState(0);
  const [campaignData, setCampaignData] = useState({});
  const [recentDonations, setRecentDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { totalDonations, donorCount } = await getTotalDonations();
      setTotalDonations(totalDonations);
      setDonorCount(donorCount);

      const campaigns = await getCampaignDonations();
      setCampaignData(campaigns);

      const donations = await getRecentDonations();
      setRecentDonations(donations);
    };

    fetchData();
  }, []);

  return (
    <div className="impact-dashboard">
      <h2>📊 Impact Reporting Dashboard</h2>

      <div className="stats">
        <div className="card">
          <h3>💰 Total Donations</h3>
          <p>${totalDonations}</p>
        </div>
        <div className="card">
          <h3>👥 Total Donors</h3>
          <p>{donorCount}</p>
        </div>
      </div>

      <h3>🚀 Campaign Performance</h3>
      <Bar
        data={{
          labels: Object.keys(campaignData),
          datasets: [{ label: "Donations", data: Object.values(campaignData), backgroundColor: "blue" }],
        }}
      />

      <h3>🕒 Recent Donations</h3>
      <ul>
        {recentDonations.map((donor, index) => (
          <li key={index}>
            {donor.name} donated ${donor.amount} on {donor.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImpactDashboard;
