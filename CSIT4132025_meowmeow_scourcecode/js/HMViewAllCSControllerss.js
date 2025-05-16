import { HomeownersEntity } from "./homeownersEntity.js";
import { HMFavouritesCSController } from "./HMFavouritesCSControllerssss.js";

export class HMViewAllCSController {
  constructor() {
    this.entity = new HomeownersEntity();
    this.favouritesController = new HMFavouritesCSController(this.getCurrentUserEmail());
  }

  // ==================== Cleaning Services ====================

  async fetchAllCleaningServices() {
    const services = await this.entity.fetchAllCleaningServices();
    return Array.isArray(services) ? services : [];
  }

  async getFilteredCleaningServices(filters = {}) {
    const services = await this.entity.getFilteredCleaningServices(filters);
    return Array.isArray(services) ? services : [];
  }

  async incrementViewCount(categoryName, serviceId) {
    if (!categoryName || !serviceId) return false;
    await this.entity.incrementViewCount(categoryName, serviceId);
    return true;
  }

  // ==================== Booking ====================

  async createBooking(serviceId, cleanerEmail, detailsText = "") {
    if (!serviceId || !cleanerEmail) return false;

    const bookingData = {
      details: detailsText,
      createdAt: new Date().toISOString()
    };

    await this.entity.createBooking(serviceId, cleanerEmail, bookingData);
    return true;
  }

  async fetchUserBookings(userEmail) {
    if (!userEmail) return [];
    const bookings = await this.entity.getUserBookings(userEmail);
    return Array.isArray(bookings) ? bookings : [];
  }

  // ==================== Favourites ====================

  async isServiceFavourited(serviceId) {
    if (!serviceId) return false;
    return await this.favouritesController.isServiceFavourited(serviceId);
  }

  async addToFavourites(serviceData) {
    if (!serviceData?.serviceId) return false;

    const favouriteData = {
      ...serviceData,
      favouritedAt: new Date().toISOString()
    };

    await this.favouritesController.addToFavourites(favouriteData);
    return true;
  }

  async removeFromFavourites(serviceId) {
    if (!serviceId) return false;
    await this.favouritesController.removeFromFavourites(serviceId);
    return true;
  }

  async toggleFavourite(serviceData) {
    if (!serviceData?.serviceId) return false;

    const isFavourited = await this.isServiceFavourited(serviceData.serviceId);
    if (isFavourited) {
      await this.removeFromFavourites(serviceData.serviceId);
      return false;
    } else {
      await this.addToFavourites(serviceData);
      return true;
    }
  }

  async getFavouritesList() {
    return await this.favouritesController.getFavourites() || [];
  }

  // ==================== Utility ====================

  getCurrentUserEmail() {
    const email = localStorage.getItem('currentUserEmail');
    return typeof email === 'string' ? email : "default@email.com";
  }

  async getServiceById(serviceId) {
    if (!serviceId) return null;
    const services = await this.fetchAllCleaningServices();
    return services.find(service => service.id === serviceId) || null;
  }
}
