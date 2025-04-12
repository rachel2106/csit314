import Firebase from "./js/firebaseAuth.js";

export class userEntity{

    creatingtoDatabase(newUser){
        let dataObj = new Firebase();
        var result = dataObj.registerNewUser(newUser);
        return result
    }

    loggintoDatabase(newUser){
        let dataObj = new Firebase();
        var result = dataObj.loggintoDatabase(newUser);
        return result
    }

    
}