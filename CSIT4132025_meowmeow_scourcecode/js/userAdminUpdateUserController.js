
import { userEntity } from './userEntity.js';  // Named import

export class userAdminUpdateUserController {
    async updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password){
        const initAdminVAAEntity = new userEntity();  // Creating an instance of userEntity
        const message = await initAdminVAAEntity.updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password);  // Call method to get user list
        return message;
    }
}
