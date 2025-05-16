
import { HomeownersEntity } from './homeownersEntity.js'; // or adjust the path if needed

export class HMSearchBKHistoryController {
  constructor() {
    this.entity = new HomeownersEntity();
  }


  async getFilteredCleaningServices(filters) {
    return await this.entity.getFilteredCleaningServices(filters);
  }
}
