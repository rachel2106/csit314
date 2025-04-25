import Firebase from "./firebaseAuth.js";

// Create an instance of Firebase
const firebase = new Firebase();

// Define the userEntity object
export class userEntity {
    // Create a user in both Firebase Auth and Firestore
    async createToDB(newUser) {
        try {
            // Call Firebase's registerUser method to handle both Firebase Auth and Firestore
            await firebase.registerUser(newUser);
            console.log("User created successfully in both Firebase Authentication and Firestore.");
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Registration failed.");
        }
    }

    // Login user by checking Firebase Auth and Firestore
    async loginToDatabase(email, password, selectedUserType) {
        try {
            // Call Firebase login function and get the result
            const result = await firebase.loginUser(email, password, selectedUserType);

            // If user data exists, return user data
            if (result.userData) {
                return {
                    status: "success",
                    userData: result.userData,  // Return the user data if login is successful
                };
            } else {
                // If no user data found, return a message
                return {
                    message: "User not found in Firestore.",
                };
            }
        } catch (error) {
            console.error("Error logging into database:", error);
            // Return an error message if the login failed
            return {
                message: "Login failed. Please check your credentials and try again.",
            };
        }
    }

    // Fetch the user list from the FirebaseAuth class
    async getUserList() {
        try {
            const userList = await firebase.getUserList(); // Using the existing instance of Firebase
            return userList;
        } catch (error) {
            console.error("Error fetching user list:", error);
            return []; // Return empty list in case of error
        }
    }

    // Update user from admin
    async updateUserDetails(updatedUser) {
        try {
            const response = await firebase.updateUserAcc(updatedUser);
            return response; // Return the response directly
        } catch (error) {
            console.error("Error updating user:", error);
            return { success: false, message: error.message || "Failed to update user." };
        }
    }


    //creating new user in admin
    async createUser(newUserObj) {
        const firebase = new Firebase(); 
        const result = await firebase.createUserByAdmin(newUserObj);
        return result;
}
}

export default userEntity;
