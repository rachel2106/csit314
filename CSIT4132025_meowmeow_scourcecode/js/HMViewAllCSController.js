// HMViewAllCSController.js
import { HomeownersEntity } from "./homeownersEntity.js";

const entity = new HomeownersEntity();

export class HMViewAllCSController {
    static async getFilteredServices(filters) {
        return await entity.fetchCleaningServices(filters);
    }

    static async getAllServices() {
        return await entity.fetchAllCleaningServices();
    }
}


