import { serviceListingEntity } from './serviceListingEntity.js';

// console.log("pmUpdateServicesController loaded");

export class cleanerUpdateServicesController {
    async updateServiceListing(updateListingObj) {
        
        const listingEntity = new serviceListingEntity();  // Creating an instance of userEntity

        const updatedListingList = await listingEntity.updateServiceListing(updateListingObj); 
        

        return updatedListingList
 
    }
}