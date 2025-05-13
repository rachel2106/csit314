// js/userAdminUpdateDescriptionController.js

import { profileEntity } from './profileEntity.js';

export class UserAdminUpdateDescriptionController {
  constructor() {
    this.entity = new profileEntity();
  }

  async updateDescription(userType, newDescription) {
    return await this.entity.updateUserTypeDescription(userType, newDescription);
  }
}
