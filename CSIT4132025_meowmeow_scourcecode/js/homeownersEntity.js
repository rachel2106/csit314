import { db } from "./firebaseAuth.js"; // Only import db
import Firebase from "./firebaseAuth.js"; // Import Firebase class

const firebase = new Firebase(); // Initialize Firebase instance

export class homeownerEntity {
  constructor() {
    this.db = db;
  }

  // ==================== Cleaning Services ====================

  async fetchAllCleaningServices() {
    return await firebase.fetchAllCleaningServices();
  }

  async fetchCleaningServices(filters) {
    return await firebase.fetchCleaningServices(filters);
  }

  // ==================== Booking ====================

  async createBooking(serviceId, cleanerEmail, userEmail, details) {
    return await firebase.createBooking(serviceId, cleanerEmail, userEmail, details);
  }

  async getUserBookings(userEmail) {
    return await firebase.getUserBookings(userEmail);
  }

  async searchBookings(userEmail, category) {
    return await firebase.searchBookings(userEmail, category);
  }

  // ==================== Favourites ====================

  async isServiceFavourited(userEmail, serviceId) {
    return await firebase.isServiceFavourited(userEmail, serviceId);
  }

  async addToFavourites(serviceData) {
    // ❗️No userEmail needed — retrieved inside firebaseAuth.js
    return await firebase.addToFavourites(serviceData);
  }

  async removeFromFavourites(userEmail, serviceId) {
    return await firebase.removeFromFavourites(userEmail, serviceId);
  }

  async getFavourites(userEmail) {
    return await firebase.getFavourites(userEmail);
  }

  async searchFavourite(userEmail, category){
    return await firebase.searchFavourite(userEmail, category);
  }

  // ==================== Booking via shortlist ====================

  async createBookingShortlist(serviceId, cleanerEmail, userEmail, details) {
    return await firebase.createBookingShortlist(serviceId, cleanerEmail, userEmail, details);
  }

  // ==================== New: Increment numOfShortlisted ====================
  
  async incrementNumOfShortlisted(countData) {
    // Delegates to Firebase class method that increments numOfShortlisted
    return await firebase.incrementNumOfShortlisted(countData);
  }

  //Increment for view Count
  async addCountView(countData){
    return await firebase.addCountView(countData);
  }
  
}
