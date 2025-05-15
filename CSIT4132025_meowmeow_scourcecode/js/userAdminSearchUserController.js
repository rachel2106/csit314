import { userEntity } from "./userEntity.js";

export class userAdminSearchUserController {
    async searchUser(searchEmail) {
        try {
            let initAdminSUEntity = new userEntity();
            
            const found = await initAdminSUEntity.searchUser(searchEmail); // Await the result
            return found;
        } catch (err) {
            console.error("Error in userAdminSearchUserController searchUser:", err);
            throw new Error("Error searching user: " + err.message);
        }
    }

}
