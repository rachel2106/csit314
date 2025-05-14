import { profileEntity } from './profileEntity.js';

export class userAdminSuspendProfileController {
    async suspendProfile(userType) {
        const profileEntityInstance = new profileEntity();
        const message = await profileEntityInstance.suspendProfile(userType);
        console.log("Profile successfully suspend/unsuspend");
        return message; // Or return the ID if needed
       
    }
}