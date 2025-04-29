// userAdminDeleteProfileController.js

import { db } from './firebaseAuth.js';  // Make sure you import your Firestore configuration

class userAdminDeleteProfileController {
    // Constructor to initialize controller
    constructor() {
        // Any setup for the controller can be added here
    }

    // Function to delete user by userType from Firestore
    async deleteUserByType(userType) {
        try {
            const userCollection = db.collection("csit314/AllUsers/UserData"); // Use the correct collection path
            const querySnapshot = await userCollection.where("userType", "==", userType).get();

            if (querySnapshot.empty) {
                throw new Error(`No users found with userType "${userType}"`);
            }

            // Delete all documents found
            querySnapshot.forEach(async (doc) => {
                await doc.ref.delete();
            });

            return `All profiles with userType "${userType}" have been deleted successfully.`;
        } catch (error) {
            throw new Error(`Error deleting users with userType "${userType}": ${error.message}`);
        }
    }
}

export { userAdminDeleteProfileController };
