import { profileEntity } from "./profileEntity.js";

export class userAdminSearchProfileController {
    async searchProfileByEmail(email) { // Ensure this function exists
        try {
            let initAdminProfileEntity = new profileEntity();
            return await initAdminProfileEntity.searchProfileByEmail(email);
        } catch (err) {
            console.error("Error in userAdminSearchProfileController searchProfileByEmail:", err);
            throw new Error("Error searching profiles by email: " + err.message);
        }
    }
}
