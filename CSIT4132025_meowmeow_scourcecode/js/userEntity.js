import Firebase from "./firebaseAuth.js";

// Create an instance of Firebase
const firebase = new Firebase();

// Define the userEntity object
const userEntity = {
    // Create a user in both Firebase Auth and Firestore
    createToDB: async function(newUser) {
        try {
            // Call Firebase's registerUser method to handle both Firebase Auth and Firestore
            await firebase.registerUser(newUser);
            console.log("User created successfully in both Firebase Authentication and Firestore.");
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Registration failed.");
        }
    },

    // Login user by checking Firebase Auth and Firestore
    loginToDatabase: async function(email, password, selectedUserType) {
        try {
            // Call Firebase login function and get the result
            const result = await firebase.loginUser(email, password, selectedUserType);

            // If user data exists, return user data
            if (result.userData) {
                return {
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
    },

    // Calling firebase's user account list
    getuserAccListFromDB: async function() {
        try {
            const result = await firebase.getProfileList();
            return result;
        } catch (error) {
            console.error("Failed to retrieve profiles:", error);
            return { allProfiles: [], allStatus: [] };
        }
    }
};

export default userEntity;
