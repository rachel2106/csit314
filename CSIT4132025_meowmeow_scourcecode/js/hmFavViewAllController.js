import { homeownerEntity } from "./homeownersEntity.js";

export class hmFavViewAllController {

  async getFavourites(userEmail) {
    const hmEntity = new homeownerEntity();
    const favServices = await hmEntity.getFavourites(userEmail);
    return favServices;
  }
}
