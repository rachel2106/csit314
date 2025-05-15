import { profileEntity } from "./profileEntity.js";

export class userAdminSearchProfileController {
    // async searchUserProfile(searchEmail) { // Ensure this function exists
    //     try {
    //         let initAdminProfileEntity = new profileEntity();
    //         return await initAdminProfileEntity.searchUserProfile(searchEmail);


    //     } catch (err) {
    //         console.error("Error in userAdminSearchProfileController searchProfileByEmail:", err);
    //         throw new Error("Error searching profiles by email: " + err.message);
    //     }
    // }

    async searchProfile(userType) {
        const entity = new profileEntity(); //creating an instance (object) of profileEntity
        const userList =  await entity.searchProfile(userType); // pass userType!
        return userList;
    }
}
