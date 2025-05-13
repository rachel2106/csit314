
import { HomeownersEntity } from './homeownersEntity.js';

export class HMFavouritesController {
  constructor() {
    this.entity = new HomeownersEntity();
  }

  async getFavourites(userId) {
    return await this.entity.getFavourites(userId);
  }
}
