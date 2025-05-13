// HMViewAllCSController.js
import { HomeownersEntity } from "./homeownersEntity.js";

export class HMViewAllCSController {
  constructor() {
    this.entity = new HomeownersEntity();
  }

  async fetchAllCleaningServices() {
    return await this.entity.fetchAllCleaningServices();
  }

  async getFilteredCleaningServices(filters) {
  return await this.entity.getFilteredCleaningServices(filters);
}


  async incrementViewCount(serviceId) {
    return await this.entity.incrementViewCount(serviceId);
  }
}
