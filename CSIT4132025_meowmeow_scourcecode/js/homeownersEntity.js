// homeownersEntity.js
import { db } from "./firebaseAuth.js";
import  Firebase  from "./firebaseAuth.js";

const firebase = new Firebase();

export class HomeownersEntity {
  constructor() {
    this.db = db;
  }

  // Fetch all services without filtering
  async fetchAllCleaningServices() {
    return await firebase.fetchAllServiceListings();
  }

  // Fetch with filtering (category, price, status)
  async fetchCleaningServices(filters) {
    return await firebase.getFilteredCleaningServices(filters);
  }

  //increment for viewcount 
  async incrementViewCount(categoryName, serviceId) {
    return await incrementViewCount(categoryName, serviceId);
  }

  //increment for shortlisted count
  async incrementShortlistCount(categoryName, serviceId) {
    return await incrementShortlistCount(categoryName, serviceId);
  }
}
