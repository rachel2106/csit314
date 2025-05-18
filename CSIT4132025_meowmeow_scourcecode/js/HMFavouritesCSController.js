import { homeownerEntity } from "./homeownersEntity.js";

export class hmFavouritesCSController {
  constructor(userEmail) {
    this.userEmail = userEmail; // This is still useful for non-firebaseAuth methods
    this.entity = new homeownerEntity();
  }

  async isServiceFavourited(serviceId) {
    return this.entity.isServiceFavourited(this.userEmail, serviceId);
  }

  async addToFavourites(serviceData) {
    return this.entity.addToFavourites(serviceData); // 🔥 Removed userEmail argument
  }

  async removeFromFavourites(serviceId) {
    return this.entity.removeFromFavourites(this.userEmail, serviceId);
  }

  async getFavourites() {
    return this.entity.getFavourites(this.userEmail);
  }

  async toggleFavourite(serviceData) {
    const isFavourited = await this.isServiceFavourited(serviceData.serviceId);
    if (isFavourited) {
      await this.removeFromFavourites(serviceData.serviceId);
      return false;
    } else {
      await this.addToFavourites(serviceData);
      return true;
    }
  }

  async incrementShortlistCount(countData) {
    return this.entity.incrementShortlistCount(countData);
  }
}
