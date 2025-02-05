import { db } from "../firebase";  
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";  

const campaignCollection = collection(db, "campaigns");

// Add Campaign
export const addCampaign = async (campaign) => {
    try {
        await addDoc(campaignCollection, campaign);
        console.log("Campaign added successfully!");
    } catch (error) {
        console.error("Error adding campaign:", error);
    }
};

// Get All Campaigns
export const getCampaigns = async () => {
    try {
        const snapshot = await getDocs(campaignCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
};

// Delete Campaign
export const deleteCampaign = async (id) => {
    try {
        await deleteDoc(doc(db, "campaigns", id));
        console.log("Campaign deleted successfully!");
    } catch (error) {
        console.error("Error deleting campaign:", error);
    }
};
