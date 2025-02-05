import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Fetch total donations & donor count
export const getTotalDonations = async () => {
  const querySnapshot = await getDocs(collection(db, "donors"));
  let totalDonations = 0;
  let donorCount = querySnapshot.size; // Count unique donors

  querySnapshot.forEach((doc) => {
    totalDonations += doc.data().amountDonated || 0;
  });

  return { totalDonations, donorCount };
};

// Fetch donations grouped by campaign
export const getCampaignDonations = async () => {
  const querySnapshot = await getDocs(collection(db, "campaigns"));
  let campaignData = {};

  querySnapshot.forEach((doc) => {
    const campaign = doc.data();
    campaignData[campaign.name] = campaign.fundsRaised || 0;
  });

  return campaignData;
};

// Fetch recent donations
export const getRecentDonations = async () => {
  const querySnapshot = await getDocs(collection(db, "donors"));
  let donations = [];

  querySnapshot.forEach((doc) => {
    const donor = doc.data();
    donations.push({
      name: donor.name,
      amount: donor.amountDonated,
      date: donor.donationDate || "Unknown",
    });
  });

  return donations.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Get last 5 donations
};
