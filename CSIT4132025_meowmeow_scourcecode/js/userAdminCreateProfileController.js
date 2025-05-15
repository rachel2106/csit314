import { profileEntity } from './profileEntity.js';

export class userAdminCreateProfileController {
    async createProfile(profileData) {
        const profileEntityInstance = new profileEntity();
        const result = profileEntityInstance.createProfile(profileData);
        return result;

    }
}

