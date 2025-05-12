import { HomeownersEntity } from "./homeownersEntity.js";

export class HMViewAllCSController {
  constructor() {
    this.entity = new HomeownersEntity();
  }

  // Fetch all services
  async getAllServices() {
    return await this.entity.fetchAllCleaningServices();
  }

  // Increment the view count for a given service
  async incrementViewCount(categoryName, serviceId) {
    return await this.entity.incrementViewCount(categoryName, serviceId);
  }

  // Increment the shortlist count for a given service
  async incrementShortlistCount(categoryName, serviceId) {
    return await this.entity.incrementShortlistCount(categoryName, serviceId);
  }
}
