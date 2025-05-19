import { db } from "./firebaseAuth.js"; // Only import db
import Firebase from "./firebaseAuth.js"; // Import Firebase class

const firebase = new Firebase(); // Initialize Firebase instance

export class homeownerEntity {
  constructor() {
    this.db = db;
  }

  // ==================== Cleaning Services ====================

  async fetchAllCleaningServices() {
    const allServices= await firebase.fetchAllCleaningServices();
    return allServices;
  }

  async fetchCleaningServices(filters) {
    const allServices = await firebase.fetchCleaningServices(filters);
    return allServices;
  }

  // ==================== Booking ====================

  async createBooking(serviceId, cleanerEmail, userEmail, details) {
    return await firebase.createBooking(serviceId, cleanerEmail, userEmail, details);
  }

  async getUserBookings(userEmail) {
    const bookingArray = await firebase.getUserBookings(userEmail);
    return bookingArray;
  }

  async searchBookings(userEmail, category) {
    const bookingList = await firebase.searchBookings(userEmail, category);
    return bookingList;
  }

  // ==================== Favourites ====================

  async isServiceFavourited(userEmail, serviceId) {
    return await firebase.isServiceFavourited(userEmail, serviceId);
  }

  async addToFavourites(serviceData) {
    // ❗️No userEmail needed — retrieved inside firebaseAuth.js
    const success =  await firebase.addToFavourites(serviceData);
    return success;
  }

  async removeFromFavourites(userEmail, serviceId) {
    return await firebase.removeFromFavourites(userEmail, serviceId);
  }

  async getFavourites(userEmail) {
    const favServices = await firebase.getFavourites(userEmail);
    return favServices;
  }

  async searchFavourite(userEmail, category){
    const allServices = await firebase.searchFavourite(userEmail, category);
    return allServices;
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
