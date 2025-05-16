import { db } from "./firebaseAuth.js"; // Only import db
import Firebase from "./firebaseAuth.js"; // Import Firebase class

const firebase = new Firebase(); // Initialize Firebase instance

export class homeownerEntity {
  constructor() {
    this.db = db;
  }

  // ==================== Cleaning Services ====================

  // Fetch all services without filters (View)
  async fetchAllCleaningServices() {
    const services = await firebase.fetchAllCleaningServices();
    return  services;
  }


  // Fetch services with filters: category, price, status (search)
  async fetchCleaningServices(filters) {
    const allServices = await firebase.fetchCleaningServices(filters);
    return allServices;
  }

  // ==================== Booking ====================

  // Book a service (To book)
  async createBooking(serviceId, cleanerEmail,userEmail, details) {
    const created = await firebase.createBooking(serviceId, cleanerEmail,userEmail, details);
    return created;
  }

  // Fetch user bookings (View)
  async getUserBookings(userEmail) {
    const result = await firebase.getUserBookings(userEmail);
    return result;
  }

  //Search user booking (Search)
  async searchBookings(userEmail, category){
    const bookingList = await firebase.searchBookings(userEmail, category);
    return bookingList;

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
