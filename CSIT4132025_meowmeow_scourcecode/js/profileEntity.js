// import firebase from 'firebase/compat/app';
// import { db } from './firebaseAuth.js';  // Import db from firebaseAuth.js
import { collection, query, where, getDocs, addDoc, Timestamp, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";  // Import updateDoc and doc
// import Firebase from "./firebaseAuth.js";
import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";

const firebase = new Firebase();

export class profileEntity {

    constructor() {
        this.db = db;
    }


    // Create new profile
    async createProfile(profileData) {
        const created = await firebase.createProfile(profileData);
        return created;
        
    }

    // Get all profiles
    async getAllProfiles() {
        const profileList = await firebase.getAllProfiles();
        return profileList;
    
    }

    // Update profile description by userType (assumes only one match; modify if multiple allowed)
    async updateUserTypeDescription(userType, newDescription) {
        const message = await firebase.updateUserTypeDescription(userType, newDescription);
        return message;
    }

    // Search profiles by userType
    async searchProfile(userType) {
        const userList = await firebase.searchProfile(userType);
        return userList;
        
    }

    //suspend profile byt userType
    async suspendProfile(userType) {
        try{
            const response = await firebase.suspendProfile(userType);
            return response;

        }catch (error) {
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }

    }

    // Search user profile by email
    // async searchUserProfile(email) {
    //     try {
    //         const cleanedEmail = email.trim().toLowerCase();
    //         const q = query(collection(db, "csit314/AllUsers/UserData"), where("email", "==", cleanedEmail));
    //         const querySnapshot = await getDocs(q);
    //         if (querySnapshot.empty) return;
    //         return querySnapshot.docs.map(doc => doc.data());
    //     } catch (error) {
    //         // Do nothing on error
    //     }
    // }

    

    // Update profile list (display in UI)
    // async updateProfileList() {
    //     const profiles = await this.getAllProfiles();  // Using 'this' to reference the current instance
    //     const profileListContainer = document.getElementById('profileList');
    //     profileListContainer.innerHTML = '';  // Clear the existing list
    
    //     profiles.forEach(profile => {
    //         const profileItem = document.createElement('div');
    //         profileItem.classList.add('profile-item');
    //         profileItem.textContent = profile.userType;
    //         profileListContainer.appendChild(profileItem);
    //     });
    // }

    
    
    // // Delete profile by userType
    // async deleteProfileByUserType(userType) {
    //     try {
    //         const profilesQuery = query(collection(db, "csit314/AllUsers/UserData"), where("userType", "==", userType));
    //         const querySnapshot = await getDocs(profilesQuery);

    //         if (!querySnapshot.empty) {
    //             querySnapshot.forEach(async (docSnapshot) => {
    //                 await deleteDoc(docSnapshot.ref);
    //             });
    //         }
    //     } catch (error) {
    //         // Do nothing on error
    //     }
    // }



    
        
}
