import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerDeleteServicesController {
    
    async deleteServiceListing(deleteListing) {
            console.log("Inside deleteCategory with data:", deleteListing);
            const listingEntity = new serviceListingEntity();  // Creating an instance of userEntity
    
            const deletedListing = await listingEntity.deleteServiceListing(deleteListing); 
            
            console.log("Category deleted successfully");
            // console.log(controller); // Check what's inside
    
            // console.log(this);
    
            return  deletedListing;
     
        }
}
