import { HomeownersEntity } from "./homeownersEntity.js";

export class HMFavouritesCSController {
  constructor(userEmail) {
    this.userEmail = userEmail;
    this.entity = new HomeownersEntity();
  }

  async isServiceFavourited(serviceId) {
    return this.entity.isServiceFavourited(this.userEmail, serviceId);
  }

  async addToFavourites(serviceData) {
    return this.entity.addToFavourites(this.userEmail, serviceData);
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
}
