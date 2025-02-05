import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const donorsCollection = collection(db, "donors");

// Add a donor
export const addDonor = async (donorData) => {
    try {
        await addDoc(donorsCollection, donorData);
    } catch (error) {
        console.error("Error adding donor:", error);
    }
};

// Get donors
export const getDonors = async () => {
    const querySnapshot = await getDocs(donorsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Update donor
export const updateDonor = async (id, updatedData) => {
    try {
        const donorRef = doc(db, "donors", id);
        await updateDoc(donorRef, updatedData);
    } catch (error) {
        console.error("Error updating donor:", error);
    }
};

// Delete donor
export const deleteDonor = async (id) => {
    try {
        await deleteDoc(doc(db, "donors", id));
    } catch (error) {
        console.error("Error deleting donor:", error);
    }
};
