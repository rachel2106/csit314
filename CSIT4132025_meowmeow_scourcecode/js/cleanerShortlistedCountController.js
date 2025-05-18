import { serviceListingEntity } from './serviceListingEntity.js';

export class cleanerShortlistedCountController {
    async shortlistedCounts(cleanerEmail){
        const cleanerEntity = new serviceListingEntity();
        const services = await cleanerEntity.shortlistedCounts(cleanerEmail);
        return services;

    }
}