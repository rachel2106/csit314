import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerViewCountController {
    // async getListingList(cleanerEmail) {
    //     const listingEntity = new serviceListingEntity();  // Create instance of entity
    //     const listingList = await listingEntity.getHistoryList(cleanerEmail);  // Fetch all categories

    //     return listingList;
    // }

    async viewCounts(cleanerEmail){
        const cleanerEntity = new serviceListingEntity();
        const services = await cleanerEntity.viewCounts(cleanerEmail);
        return services;

    }
}