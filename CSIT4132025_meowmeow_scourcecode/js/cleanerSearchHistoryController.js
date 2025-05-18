import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerSearchHistoryController {
    async searchBookingHistory(searchData) {
        const listingEntity = new serviceListingEntity();  // Create instance of entity
        const listingList = await listingEntity.searchBookingHistory(searchData);  // Fetch all categories

        return listingList;
    }
}