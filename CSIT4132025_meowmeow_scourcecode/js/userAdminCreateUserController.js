import { userEntity } from "./userEntity.js";

export class adminCreateUserController {
    async createUserAcc(newUserObj) {
        const initAdminCUEntity = new userEntity(); //instantiates the userEntity class and assigns the variable
        const message = await initAdminCUEntity.createUser(newUserObj); //calls the method then createUser is passed which contains details of the new user created
        return message;
    }
}

