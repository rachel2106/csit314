import { db } from "./firebaseAuth.js"; // Only import db
import Firebase from "./firebaseAuth.js"; // Import Firebase class

const firebase = new Firebase(); // Initialize Firebase instance

export class HomeownersEntity {
  constructor() {
    this.db = db;
  }

  // ==================== Cleaning Services ====================

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

  // ==================== Booking ====================

  // Book a service
  async createBooking(serviceId, cleanerEmail, details) {
    return await firebase.createBooking(serviceId, cleanerEmail, details);
  }



  // Fetch user bookings
  async getUserBookings(userEmail) {
    return await firebase.getUserBookings(userEmail);
  }

  // ==================== Favourites ====================

  // Check if service is already favourited
  async isServiceFavourited(userEmail, serviceId) {
    return await firebase.isServiceFavourited(userEmail, serviceId);
  }

  // Add service to favourites
  async addToFavourites(userEmail, serviceData) {
    return await firebase.addToFavourites(userEmail, serviceData);
  }

  // Remove service from favourites
  async removeFromFavourites(userEmail, serviceId) {
    return await firebase.removeFromFavourites(userEmail, serviceId);
  }

  // Get all favourited services
  async getFavourites(userEmail) {
    return await firebase.getFavourites(userEmail);
  }
}
