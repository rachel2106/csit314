// homeownersEntity.js
import { db } from "./firebaseAuth.js";
import  Firebase  from "./firebaseAuth.js";

const firebase = new Firebase();

export class HomeownersEntity {
  constructor() {
    this.db = db;
  }

 // Fetch all services without filters
  async fetchAllCleaningServices() {
    return await firebase.fetchAllServiceListings();
  }

  // Fetch services with filters: category, price, status
 async getFilteredCleaningServices(filters) {
  return await firebase.getFilteredCleaningServices(filters);
}
  // Increment view count
  async incrementViewCount(categoryName, serviceId) {
    return await firebase.incrementViewCount(categoryName, serviceId);
  }

  // Increment shortlist count
  async incrementShortlistCount(categoryName, serviceId) {
    return await firebase.incrementShortlistCount(categoryName, serviceId);
  }

  // Book a cleaning service
  async createBooking(serviceId, cleanerId, bookingDetails) {
    return await firebase.createBooking(serviceId, cleanerId, bookingDetails);
  }

  // Get booking history for logged-in homeowner
  async getBookingHistory() {
    return await firebase.fetchBookingHistory();
  }
}
