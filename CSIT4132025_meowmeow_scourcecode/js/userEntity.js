import Firebase from "./firebaseAuth.js";

export class userEntity {
    constructor() {
        this.Firebase = new Firebase(); // Create Firebase instance
    }

    // Create a user in both Firebase Auth and Firestore
    async createToDB(newUser) {
        try {
            // Call Firebase's registerUser method to handle both Firebase Auth and Firestore
            await this.Firebase.registerUser(newUser);
            console.log("User created successfully in both Firebase Authentication and Firestore.");
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Registration failed.");
        }
    }

    // Login user by checking Firebase Auth and Firestore
       async loginToDatabase(email, password, selectedUserType) {
        try {
            const result = await this.Firebase.loginUser(email, password, selectedUserType);
            return result;
        } catch (error) {
            console.error("Error logging into database:", error);
            throw new Error("Login failed.");
        }
    }
}
