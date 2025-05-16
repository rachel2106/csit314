import { homeownerEntity } from "./homeownersEntity.js";

export class hmSearchAllCSController{

  async fetchCleaningServices(filters) {

    const hmEntity = new homeownerEntity();
    const allServices = await hmEntity.fetchCleaningServices(filters);

    return allServices;
  }

}