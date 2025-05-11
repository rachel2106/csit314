
// homeownersEntity.js
import { db } from "./firebaseAuth.js";
import { collection, getDocs, query, where } from "./firebaseAuth.js";

export class HomeownersEntity {
    constructor() {}

    // Fetch all cleaning services
    async fetchAllCleaningServices() {
        const servicesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
        const querySnapshot = await getDocs(servicesRef);
        const services = [];

        querySnapshot.forEach((doc) => {
            services.push(doc.data());
        });

        return services;
    }

    // Fetch filtered cleaning services based on user selection
    async fetchCleaningServices(filters) {
        const servicesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
        let q = servicesRef;

        const conditions = [];

        if (filters.category) {
            conditions.push(where("category", "==", filters.category));
        }

        if (filters.status) {
            conditions.push(where("status", "==", filters.status));
        }

        if (filters.price) {
            const priceRange = filters.price.split("-");
            const minPrice = parseInt(priceRange[0]);
            const maxPrice = parseInt(priceRange[1]);
            conditions.push(where("price", ">=", minPrice));
            conditions.push(where("price", "<=", maxPrice));
        }

        if (conditions.length > 0) {
            q = query(servicesRef, ...conditions);
        }

        const querySnapshot = await getDocs(q);
        const services = [];

        querySnapshot.forEach((doc) => {
            services.push(doc.data());
        });

        return services;
    }
}
