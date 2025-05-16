import { homeownerEntity } from "./homeownersEntity.js";


export class hmViewBookListingController{

    async createBooking(serviceId, cleanerEmail, userEmail, details) {
        const hmEntity = new homeownerEntity();
        const created = hmEntity.createBooking(serviceId, cleanerEmail,userEmail, details);
        return created;
      }

    async getUserBookings(userEmail) {
        // const userEmail = 'user@example.com'; // Use the actual user email from your authentication system
        const hmEntity = new homeownerEntity();
        const result = hmEntity.getUserBookings(userEmail);
        return result;
    }

    
}