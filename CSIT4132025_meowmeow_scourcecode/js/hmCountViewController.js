import { homeownerEntity } from "./homeownersEntity.js";


export class hmCountViewController{

    async addCountView(countData){
        const hmEntity = new homeownerEntity();
        const services = await hmEntity.addCountView(countData);
        return services;

    }
}