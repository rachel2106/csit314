import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";
// import { collection, query, where, getDocs, setDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebase = new Firebase(); // Using the same Firebase instance

export class serviceCategoryEntity {
    constructor() {
        this.db = db;
    }

    // Create a new service category
    async createServiceCategory(categoryObj) {
        try {
            const response = await firebase.createServiceCategory(categoryObj);
            return response;
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

    // // Update a service category
    // async updateCategory(updatedCategoryObj) {
    //     try {
    //         const response = await firebase.updateServiceCategory(updatedCategoryObj);
    //         return response;
    //     } catch (error) {
    //         console.error("Error updating category:", error);
    //         return { status: "error", message: error.message };
    //     }
    // }

    // // Delete a service category
    // async deleteCategory(categoryId) {
    //     try {
    //         const response = await firebase.deleteServiceCategory(categoryId);
    //         return response;
    //     } catch (error) {
    //         console.error("Error deleting category:", error);
    //         return { status: "error", message: error.message };
    //     }
    // }

    // // Optional: Search for category by name
    // async searchCategory(name) {
    //     try {
    //         const categoryCollection = collection(this.db, "csit314/ServiceCategories");
    //         const q = query(categoryCollection, where("name", "==", name.trim()));
    //         const snapshot = await getDocs(q);

    //         const categories = snapshot.docs.map(doc => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }));

    //         return {
    //             status: "success",
    //             data: categories
    //         };
    //     } catch (error) {
    //         console.error("Error searching for category:", error);
    //         return { status: "error", message: error.message };
    //     }
    // }
}

export default serviceCategoryEntity;
