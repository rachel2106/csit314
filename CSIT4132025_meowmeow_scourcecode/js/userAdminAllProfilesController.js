import { profileEntity } from "./profileEntity.js";

export class userAdminAllProfilesController {
    async getAllProfiles() {
        const entity = new profileEntity();
        return await entity.getAllProfiles();
    }

    async searchProfile(userType) {
        const entity = new profileEntity();
        return await entity.searchProfiles(userType); // pass userType!
    }
}
