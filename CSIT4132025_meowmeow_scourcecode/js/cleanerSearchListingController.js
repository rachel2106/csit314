import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerSearchServicesController {
    
    async searchServiceListing(searchListing) {
            console.log("Inside search Listing with data:", searchListing);
            const listingEntity = new serviceListingEntity();  // Creating an instance of userEntity
    
            const searchedListingList = await listingEntity.searchServiceListing(searchListing); 
            
            // console.log("Category searched successfully");
            return searchedListingList
     
        }
}
