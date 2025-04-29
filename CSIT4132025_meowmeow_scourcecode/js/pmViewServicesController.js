import { serviceCategoryEntity } from './serviceCategoryEntity.js';

export class pmViewServicesController {
    async getCategoryList() {
        const serviceEntity = new serviceCategoryEntity();  // Create instance of entity
        const categoryList = await serviceEntity.getCategoryList();  // Fetch all categories
        // console.log("Fetched categories from serviceEntity:", categoryList);

        return categoryList;
    }
}
