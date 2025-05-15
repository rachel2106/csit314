// js/userAdminUpdateDescriptionController.js

import { profileEntity } from './profileEntity.js';

export class UpdateUserTypeDescriptionController {
  // Method to update the description for a given user type
  async updateUserTypeDescription(userType, newDescription) {
    const entity = new profileEntity();
    const message = await entity.updateUserTypeDescription(userType, newDescription); // Just return the result
  
    return message;
  }
}
