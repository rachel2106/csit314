
import { serviceCategoryEntity } from './serviceCategoryEntity.js';
export class pmDeleteServicesController {
    
    async deleteServiceCategory(deleteCategory) {
            console.log("Inside updateCategory with data:", deleteCategory);
            const serviceEntity = new serviceCategoryEntity();  // Creating an instance of userEntity
    
            const deletedCategoryList = await serviceEntity.deleteServiceCategory(deleteCategory); 
            
            console.log("Category updated successfully");
            // console.log(controller); // Check what's inside
    
            // console.log(this);
    
            return deletedCategoryList
     
        }
}
