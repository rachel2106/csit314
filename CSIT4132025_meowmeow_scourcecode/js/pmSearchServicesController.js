
import { serviceCategoryEntity } from './serviceCategoryEntity.js';
export class pmSearchServicesController {
    
    async searchServiceCategory(searchCategory) {
            console.log("Inside searchCategory with data:", searchCategory);
            const serviceEntity = new serviceCategoryEntity();  // Creating an instance of userEntity
    
            const searchedCategoryList = await serviceEntity.searchServiceCategory(searchCategory); 
            
            console.log("Category searched successfully");
            // console.log(controller); // Check what's inside
    
            // console.log(this);
    
            return searchedCategoryList
     
        }
}
