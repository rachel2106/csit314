import { serviceCategoryEntity } from './serviceCategoryEntity.js';

// console.log("pmUpdateServicesController loaded");

export class pmUpdateServicesController {
    async updateServiceCategory(updateCategoryObj) {
        console.log("Inside updateCategory with data:", updateCategoryObj);
        const serviceEntity = new serviceCategoryEntity();  // Creating an instance of userEntity

        const updatedCategoryList = await serviceEntity.updateServiceCategory(updateCategoryObj); 
        
        // console.log(controller); // Check what's inside
        console.log("Category updated successfully");
        // console.log(this);

        return updatedCategoryList
 
    }
}