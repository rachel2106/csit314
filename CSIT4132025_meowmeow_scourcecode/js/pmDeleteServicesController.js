
import { serviceCategoryEntity } from './serviceCategoryEntity.js';
export class pmDeleteServicesController {
    
    async deleteServiceCategory(deleteCategory) {
            // console.log("Inside deleteCategory with data:", deleteCategory);
            const serviceEntity = new serviceCategoryEntity();  // Creating an instance of userEntity
    
            const success = await serviceEntity.deleteServiceCategory(deleteCategory); 
            
            // console.log("Category deleted successfully");
            // console.log(controller); // Check what's inside
    
            // console.log(this);
    
            return success
     
        }
}
