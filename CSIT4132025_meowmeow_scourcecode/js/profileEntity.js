import Firebase from './firebaseAuth.js';

export class profileEntity {
    async getAllProfiles() {
        const firebaseObj = new Firebase();
        return await firebaseObj.getAllProfiles();
    }

    async searchProfiles(searchType) {
        const firebaseObj = new Firebase();
        return await firebaseObj.searchProfile(searchType);
    }
}
