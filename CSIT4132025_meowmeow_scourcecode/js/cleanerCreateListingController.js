import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerCreateListingController {
    
    async createServiceListing(newListingObj) {
        const listingEntity = new serviceListingEntity();  // Create instance of entity
        const result = await listingEntity.createServiceListing(newListingObj);  // Call creation method
        return result;
    }
}