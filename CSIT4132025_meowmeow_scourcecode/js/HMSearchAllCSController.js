import { HomeownersEntity } from "./homeownersEntity.js";

export class HMSearchAllCSController {
  constructor() {
    this.entity = new HomeownersEntity();
  }
  // Fetch services based on filters
  async getFilteredServices(filters) {
    return await this.entity.fetchCleaningServices(filters);
  }
}

