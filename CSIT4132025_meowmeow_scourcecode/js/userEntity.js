import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";



const firebase = new Firebase(); // Use the existing Firebase instance initialized in firebaseAuth.js

export class userEntity {
    // Create a user in both Firebase Auth and Firestore
    async createToDB(newUser) {
        try {
            // Call Firebase's registerUser method to handle Firestore user creation
            await firebase.registerUser(newUser);
            console.log("User created successfully in Firestore.");
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Registration failed.");
        }
    }

    // Login user by checking Firestore (no Firebase Auth)
    async loginUser(email, password, selectedUserType) {
        try {
            // Ensure the Firestore collection path is correct
            const userCollection = collection(db, "csit314/AllUsers/UserData");
    
            // Construct query to find the user with the matching email
            const q = query(userCollection, where("email", "==", email));
            console.log("Firestore Query:", q); // Debug log to check query
    
            // Execute the query and get the results
            const querySnapshot = await getDocs(q);
            console.log("Query Snapshot Size:", querySnapshot.size); // Check if there are results
    
            // If no matching user, return error
            if (querySnapshot.empty) {
                return { status: "error", message: "No user found with this email." };
            }
    
            // Extract the user data from the first document
            const userData = querySnapshot.docs[0].data();
            console.log("Found user data:", userData); // Debug log to check user data
    
            // Compare the stored password from Firestore with the provided password
            if (userData.password !== password) {
                return { status: "error", message: "Incorrect password." };
            }
    
            // Check if the user type matches the selected user type
            if (userData.userType !== selectedUserType) {
                return { status: "error", message: `Incorrect account type. You registered as ${userData.userType}.` };
            }
    
            // If everything is correct, return success
            return { status: "success", message: "Login successful", userData };
    
        } catch (error) {
            console.error("Login error:", error.message);
            return { status: "error", message: "Login failed. Please try again." };
        }
    }
       

    // Fetch the user list from Firestore (if needed for admin purposes)
    async getUserList() {
        try {
            const userList = await firebase.getUserList();  // Using the existing instance of Firebase
            return userList;
        } catch (error) {
            console.error("Error fetching user list:", error);
            return [];  // Return empty list in case of error
        }
    }

    // Update user from admin
    async updateUserDetails(updatedUser) {
        try {
            const response = await firebase.updateUserAcc(updatedUser);
            return response;  // Return the response directly
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
            const userList = await firebase.searchUser(searchEmail);  // Fetch from FirebaseAuth
            if (!userList || userList.length === 0) {
                console.warn("No user found with email:", searchEmail);
                return null;  // Ensure it returns null if no user is found
            }

            console.log("User found:", userList[0]);  // Debugging log
            return userList[0];  // Return the first matched user
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
                throw error;  // Pass error upwards
            });
    }
              

        
        }
        
        export default userEntity;
        
