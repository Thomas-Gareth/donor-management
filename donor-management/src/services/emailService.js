import emailjs from "@emailjs/browser";

const sendEmailReport = (donorEmail, reportData) => {
  const templateParams = {
    to_email: donorEmail,
    total_donations: reportData.totalDonations,
    avg_donation: reportData.averageDonation.toFixed(2),
    top_campaign: reportData.topCampaign,
  };

  return emailjs.send(
    "YOUR_SERVICE_ID",
    "YOUR_TEMPLATE_ID",
    templateParams,
    "YOUR_USER_ID"
  );
};

export default sendEmailReport;
