import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";

const firebase = new Firebase(); // Using the same Firebase instance

export class serviceCategoryEntity {
    constructor() {
        this.db = db;
    }

    // Create a new service category
    async createServiceCategory(newCategoryObj) {
        try {
            const message = await firebase.createServiceCategory(newCategoryObj);
            return message;
        } catch (error) {
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }
    }

    // Fetch all service categories
    async getCategoryList() {
        try {
            const categoryList = await firebase.getCategoryList();
            return categoryList;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
            // return { status: "error", message: error.message };
        }
    }

    // Update a service category
    async updateServiceCategory(updatedCategoryObj) {
        try {
            const updatedCategoryList = await firebase.updateServiceCategory(updatedCategoryObj);
            return updatedCategoryList;
        } catch (error) {
            console.error("Error updating category:", error);
            return { status: "error", message: error.message };
        }
    }

    // Delete a service category
    async deleteServiceCategory(deleteCategory) {
        try {
            const deleted = await firebase.deleteServiceCategory(deleteCategory);
            return deleted;
        } catch (error) {
            console.error("Error deleting category:", error);
            return { status: "error", message: error.message };
        }
    }

    // // Optional: Search for category by name
    async searchServiceCategory(searchCategory) {
        try {
            const searched = await firebase.searchServiceCategory(searchCategory);
            return searched;
        } catch (error) {
            console.error("Error searching for category:", error);
            return { status: "error", message: error.message };
        }
    }
    
}

export default serviceCategoryEntity;
