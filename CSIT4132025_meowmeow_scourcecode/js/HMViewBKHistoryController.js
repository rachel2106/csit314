import { HomeownersEntity } from "./homeownersEntity.js";

export class HMViewBKHistoryController {
  constructor() {
    this.entity = new HomeownersEntity();
  }

  async fetchBookingsForCurrentUser() {
    const userEmail = 'user@example.com'; // Use the actual user email from your authentication system
    return await this.entity.getUserBookings(userEmail);
  }
}


