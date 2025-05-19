import { homeownerEntity } from "./homeownersEntity.js";

export class hmViewBookListingController {

    async createBooking(serviceId, cleanerEmail, details) {
        const userEmail = localStorage.getItem('loggedInUserEmail');

        if (!userEmail || typeof userEmail !== 'string') {
            return false;
        }

        const hmEntity = new homeownerEntity();
        const created = await hmEntity.createBooking(serviceId, cleanerEmail, userEmail, details);
        return created;
    }

    // Use this to add a service to shortlist/favourites
    async createBookingShortlist(serviceId, cleanerEmail, userEmail, details) {
        if (!userEmail || typeof userEmail !== 'string') {
            return false;
        }

        const hmEntity = new homeownerEntity();
        try {
            const created = await hmEntity.createBookingShortlist(serviceId, cleanerEmail, userEmail, details);
            return created;
        } catch (error) {
            return false;
        }
    }

    async getUserBookings() {
        const userEmail = localStorage.getItem('loggedInUserEmail');

        if (!userEmail || typeof userEmail !== 'string') {
            return [];
        }

        const hmEntity = new homeownerEntity();
        const bookingArray = await hmEntity.getUserBookings(userEmail);
        return bookingArray;
    }
}
