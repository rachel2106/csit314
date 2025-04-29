import { profileEntity } from './profileEntity.js';

export class userAdminCreateProfileController {
    async createProfile(profile) {
        const profileEntityInstance = new profileEntity();

        // Call createProfile in profileEntity to save it to Firestore
        try {
            await profileEntityInstance.createProfile(profile);
            console.log("Profile successfully created");
            return profile.name; // Or return the ID if needed
        } catch (error) {
            console.error("Error creating profile:", error);
            throw error;
        }
    }
}

