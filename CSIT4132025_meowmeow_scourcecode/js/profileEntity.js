// profileEntity.js

import { db } from './firebaseAuth.js';  // Import db from firebaseAuth.js
import { collection, query, where, getDocs, addDoc, Timestamp, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export class profileEntity {
    // Get all profiles
    async getAllProfiles() {
        try {
            const querySnapshot = await getDocs(collection(db, "csit314/AllUsers/UserData"));
            return querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error("Error fetching profiles:", error);
            throw error;
        }
    }

    // Search profiles by userType
    async searchProfiles(userType) {
        const q = query(collection(db, "csit314/AllUsers/UserData"), where("userType", "==", userType));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    }

    // Search user profile by email
    async searchUserProfile(email) {
        const cleanedEmail = email.trim().toLowerCase();
        const q = query(collection(db, "csit314/AllUsers/UserData"), where("email", "==", cleanedEmail));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return null;
        return querySnapshot.docs.map(doc => doc.data());
    }

    // Create new profile
    async createProfile(profileData) {
        try {
            const docRef = await addDoc(collection(db, "csit314/AllUsers/UserData"), {
                ...profileData,
                createdDate: Timestamp.now(),
                lastUpdated: Timestamp.now()
            });
            console.log("Profile created with ID:", docRef.id);  // Add more detailed logging
            return docRef.id;
        } catch (error) {
            console.error("Error creating profile:", error);
            throw error;
        }
    }

    async updateProfileList() {
        const profileEntityInstance = new profileEntity();
        try {
            const profiles = await profileEntityInstance.getAllProfiles();
    
            const profileListContainer = document.getElementById('profileList');
            profileListContainer.innerHTML = ''; // Clear the existing list
    
            // Display each profile's userType (profile name)
            profiles.forEach(profile => {
                const profileItem = document.createElement('div');
                profileItem.classList.add('profile-item');
                profileItem.textContent = profile.userType; // Display the userType (profile name)
                profileListContainer.appendChild(profileItem);
            });
        } catch (error) {
            console.error("Error updating profile list:", error);
        }
    }
    
    async deleteProfileByUserType(userType) {
        try {
            const profilesQuery = query(collection(db, "csit314/AllUsers/UserData"), where("userType", "==", userType));
            const querySnapshot = await getDocs(profilesQuery);

            if (querySnapshot.empty) {
                throw new Error(`No profiles found with userType "${userType}"`);
            }

            querySnapshot.forEach(async (docSnapshot) => {
                await deleteDoc(docSnapshot.ref);
                console.log(`Profile with userType "${userType}" deleted successfully`);
            });

            return `Profiles with userType "${userType}" deleted successfully`;
        } catch (error) {
            throw new Error(`Error deleting profiles with userType "${userType}": ${error.message}`);
        }
    }

}
