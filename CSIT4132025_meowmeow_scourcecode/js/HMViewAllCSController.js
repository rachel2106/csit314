import { homeownerEntity } from "./homeownersEntity.js";


export class hmViewAllCSController{

    async fetchAllCleaningServices(){
        const hmEntity = new homeownerEntity();
        const allServices = await hmEntity.fetchAllCleaningServices();
        return allServices;

    }

    
}