import Firebase from "./firebaseAuth.js"; // Import the Firebase instance

const firebase = new Firebase(); // Use the existing Firebase instance initialized in firebaseAuth.js

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

    // Create new user in admin
    async createUser(newUserObj) {
        const result = await firebase.createUserByAdmin(newUserObj);
        return result;
    }


            // Searching for user by email (Admin)
            async searchUser(searchEmail) {
                try {
                    const userList = await firebase.searchUser(searchEmail); // Fetch from FirebaseAuth
                    if (!userList || userList.length === 0) {
                        console.warn("No user found with email:", searchEmail);
                        return null; // Ensure it returns null if no user is found
                    }
        
                    console.log("User found:", userList[0]); // Debugging log
                    return userList[0]; // Return the first matched user
                } catch (err) {
                    console.error("Error in userEntity searchUser:", err);
                    throw new Error("Error in userEntity searchUser: " + err.message);
                }
            }
        


            // Admin delete user
            async deleteUser(userEmail) {
                return firebase.deleteUser(userEmail)
                    .then(result => {
                        console.log(`User with email ${userEmail} has been successfully deleted.`);
                        return result;
                    })
                    .catch(error => {
                        console.error(`Failed to delete user with email ${userEmail}:`, error);
                        throw error; // Pass error upwards
                    });
            }

              

        
        }
        
        export default userEntity;
        
