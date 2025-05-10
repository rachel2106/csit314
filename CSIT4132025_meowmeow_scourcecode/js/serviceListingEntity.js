import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";

const firebase = new Firebase(); // Using the same Firebase instance

export class serviceListingEntity {
    constructor() {
        this.db = db;
    }

    // Create a new service category
    async createServiceListing(listingObj) {
        try {
            const response = await firebase.createServiceListing(listingObj);
            return response;
        } catch (error) {
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }
    }

    // Fetch all service categories
    async getListingList(cleanerEmail) {
        try {
            const listingList = await firebase.getListingList(cleanerEmail);
            return listingList;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
            // return { status: "error", message: error.message };
        }
    }

}

export default serviceListingEntity;
