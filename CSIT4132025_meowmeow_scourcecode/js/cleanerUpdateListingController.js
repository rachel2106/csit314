import { serviceListingEntity } from './serviceListingEntity.js';

// console.log("pmUpdateServicesController loaded");

export class cleanerUpdateServicesController {
    async updateServiceListing(updateListingObj) {
        console.log("Inside updateCategory with data:", updateListingObj);
        const listingEntity = new serviceListingEntity();  // Creating an instance of userEntity

        const updatedListingList = await listingEntity.updateServiceListing(updateListingObj); 
        
        // console.log(controller); // Check what's inside
        console.log("Category updated successfully");
        // console.log(this);

        return updatedListingList
 
    }
}