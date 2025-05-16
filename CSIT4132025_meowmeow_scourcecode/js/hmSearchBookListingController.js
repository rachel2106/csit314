import { homeownerEntity } from "./homeownersEntity.js";


export class hmSearchBookListingController{

    async searchBookings(userEmail, category) {
        const hmEntity = new homeownerEntity();
        const bookingList = hmEntity.searchBookings(userEmail, category);
        return bookingList;
      }
    
}