import { homeownerEntity } from "./homeownersEntity.js";

export class hmFavSearchController{

  async searchFavourite(userEmail, category) {

    const hmEntity = new homeownerEntity();
    const allServices = await hmEntity.searchFavourite(userEmail, category);
    
    return allServices;
  }

}