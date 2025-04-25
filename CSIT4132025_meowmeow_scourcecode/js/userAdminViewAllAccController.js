// userAdminViewAllAccController.js
import { userEntity } from './userEntity.js';  // Named import

export class userAdminViewAllAccController {
    async getUserList() {
        const initAdminVAAEntity = new userEntity();  // Creating an instance of userEntity
        const userList = await initAdminVAAEntity.getUserList();  // Call method to get user list
        return userList;
    }
}
