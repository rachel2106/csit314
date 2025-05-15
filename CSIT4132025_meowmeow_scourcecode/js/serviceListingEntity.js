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

    // Update a service category
    async updateServiceListing(updatedListingObj) {
        try {
            const updatedListingList = await firebase.updateServiceListing(updatedListingObj);
            return updatedListingList;
        } catch (error) {
            console.error("Error updating category:", error);
            return { status: "error", message: error.message };
        }
    }

    // Delete a service category
    async deleteServiceListing(deleteListing) {
        try {
            const deleted = await firebase.deleteServiceListing(deleteListing);
            return deleted;
        } catch (error) {
            console.error("Error deleting category:", error);
            return { status: "error", message: error.message };
        }
    }

    async searchServiceListing(searchListing) {
        try {
            const searched = await firebase.searchServiceListing(searchListing);
            return searched;
        } catch (error) {
            console.error("Error searching for category:", error);
            return { status: "error", message: error.message };
        }
    }

    async getHistoryList(cleanerEmail) {
        try {
            const listingList = await firebase.getHistoryList(cleanerEmail);
            return listingList;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
            // return { status: "error", message: error.message };
        }
    }

}

export default serviceListingEntity;
