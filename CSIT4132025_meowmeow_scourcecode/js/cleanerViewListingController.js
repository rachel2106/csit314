import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerViewServicesController {
    async getListingList(cleanerEmail) {
        const listingEntity = new serviceListingEntity();  // Create instance of entity
        const listingList = await listingEntity.getListingList(cleanerEmail);  // Fetch all categories

        return listingList;
    }
}