import { profileEntity } from "./profileEntity.js";

export class userAdminAllProfilesController {
    async getAllProfiles() {
        const entity = new profileEntity(); //creating an instance (object) of profileEntity
        const profileList = await entity.getAllProfiles();
        return profileList;
    }

    

    
}
