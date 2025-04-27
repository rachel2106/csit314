import Firebase from './firebaseAuth.js';

const firebase = new Firebase(); // Use the existing Firebase instance initialized in firebaseAuth.js


export class profileEntity {
    async getAllProfiles() {
        const firebaseObj = new Firebase();
        return await firebaseObj.getAllProfiles();
    }

    async searchProfiles(searchType) {
        const firebaseObj = new Firebase();
        return await firebaseObj.searchProfile(searchType);
    }


    //search using input 
    async getAllProfiles() {
        return await firebase.getAllProfiles(); // Use existing instance
    }

    async searchProfiles(searchType) {
        return await firebase.searchProfile(searchType); //  Use existing instance
    }

    // Search by userType instead of email
    async searchProfileByUserType(userType) { // Ensure correct function name
        try {
            const cleanedUserType = userType.trim().toLowerCase();
            const qx = query(
                collection(db, "CSIT314/AllUsers/UserData"),
                where("userType", "==", cleanedUserType)
            );

            const querySnapshot = await getDocs(qx);
            if (querySnapshot.empty) return [];

            return querySnapshot.docs.map(doc => doc.data()); // Return structured data
        } catch (err) {
            console.error("Firestore error:", err);
            throw new Error("Error searching Firestore by userType: " + err.message);
        }
    }



}
