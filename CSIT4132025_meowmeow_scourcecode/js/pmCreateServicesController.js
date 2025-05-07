import { serviceCategoryEntity } from './serviceCategoryEntity.js';

export class pmCreateServicesController {
    
    async createServiceCategory(newCategoryObj) {
        const serviceEntity = new serviceCategoryEntity();  // Create instance of entity
        const result = await serviceEntity.createServiceCategory(newCategoryObj);  // Call creation method
        return result;
    }
}

