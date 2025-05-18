import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerViewHistoryController {
    async getHistoryList(cleanerEmail) {
        const listingEntity = new serviceListingEntity();  // Create instance of entity
        const listingList = await listingEntity.getHistoryList(cleanerEmail);  // Fetch all categories

        return listingList;
    }
}