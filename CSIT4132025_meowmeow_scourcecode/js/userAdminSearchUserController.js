import { userEntity } from "./userEntity.js";

export class userAdminSearchUserController {
    async searchUser(searchEmail) {
        try {
            let initAdminSUEntity = new userEntity();
            return await initAdminSUEntity.searchUser(searchEmail); // Await the result
        } catch (err) {
            console.error("Error in userAdminSearchUserController searchUser:", err);
            throw new Error("Error searching user: " + err.message);
        }
    }

}
