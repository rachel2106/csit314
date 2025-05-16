import { homeownerEntity } from "./homeownersEntity.js";


export class hmViewAllCSController{

    async fetchAllCleaningServices(){
        const hmEntity = new homeownerEntity();
        const services = await hmEntity.fetchAllCleaningServices();
        return services;

    }

    
}