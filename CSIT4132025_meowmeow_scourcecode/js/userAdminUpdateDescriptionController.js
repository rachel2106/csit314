// js/userAdminUpdateDescriptionController.js

import { profileEntity } from './profileEntity.js';

export async function updateUserTypeDescription(userType, newDescription) {
  const entity = new profileEntity();
  return await entity.updateUserTypeDescription(userType, newDescription); // Just return the result
}
