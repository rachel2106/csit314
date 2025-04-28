import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";



const firebase = new Firebase(); // Use the existing Firebase instance initialized in firebaseAuth.js

export class userEntity {

    constructor(){
        this.db = db;
    }

    // Create a user in both Firebase Auth and Firestore
    async createToDB(newUser) {
        try {
            // Use the email as the document ID
            const userDocRef = doc(this.db, "csit314/AllUsers/UserData", newUser.userEmail); // db is already imported

            // Create the document with the email as ID
            await setDoc(userDocRef, {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.userEmail,
                password: newUser.userPass,
                userType: newUser.userType,
                userStatus: "Active",
            });

            console.log("User successfully added to Firestore.");
        } catch (error) {
            console.error("Error during Firestore registration:", error);
            throw new Error("Registration failed in Firestore.");
        }
    }

    
    

   
    // Login user by checking Firestore directly (no Firebase Auth)
    async loginUser(email, password, userType) {
    try {
        console.log("Login attempt with userType:", userType);  // Debugging log
        const usersCollection = collection(db, "csit314/AllUsers/UserData");
        const q = query(usersCollection, where("email", "==", email), where("userType", "==", userType));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { status: "error", message: "No user found with this email and profile." };
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Check password
        if (userData.password === password) {
            return { status: "success", userData };
        } else {
            return { status: "error", message: "Incorrect password." };
        }
    } catch (err) {
        console.error("Error during login:", err.message);
        throw new Error("Login failed.");
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
        
