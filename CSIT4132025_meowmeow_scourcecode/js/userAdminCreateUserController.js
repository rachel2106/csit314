import { userEntity } from "./userEntity.js";

export class adminCreateUserController {
    async createUserAcc(newUserObj) {
        const initAdminCUEntity = new userEntity();
        const message = await initAdminCUEntity.createUser(newUserObj);
        return message;
    }
}

