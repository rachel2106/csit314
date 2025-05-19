import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";
import { collection, query, where, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";



const firebase = new Firebase(); // Use the existing Firebase instance initialized in firebaseAuth.js

export class userEntity {

    constructor(){
        this.db = db;
    }

    // Create a user in both Firebase Auth and Firestore
    // Registration
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
            const status = "success";
            return status;

            // console.log("User successfully added to Firestore.");
        } catch (error) {
            const status = "fail";
            console.error("Error during Firestore registration:", error);
            throw new Error("Registration failed in Firestore.");
            return status;
        }
    }

    
    

   
    // Login user by checking Firestore directly (no Firebase Auth)
    // Login
    async loginUser(email, password, userType) {
        try {
            console.log("Login attempt with userType:", userType);  // Debugging log
            const usersCollection = collection(db, "csit314/AllUsers/UserData");
            const q = query(usersCollection, where("email", "==", email), where("userType", "==", userType));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                const result = { status: "error", message: "No user found with this email and profile." }
                return result;
            }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            if( userData.userStatus !== "Active" || userData.profileStatus !== "Active"){
                const result = { status: "error", message: "Inactive Account/Profile." };
                return result ;
            }

            // Check password
            if (userData.password === password) {
                const result = { status: "success", userData };
                return result;
            } else {
                const result = { status: "error", message: "Incorrect password." };
                return result ;
            }

        } catch (err) {
            console.error("Error during login:", err.message);
            throw new Error("Login failed.");
        }
    }

    // Create new user in admin
    async createUser(newUserObj) {
        const result = await firebase.createUser(newUserObj);
        return result;
    }

    // Fetch the user list from Firestore (if needed for admin purposes)
    async getUserList() {
        try {
            const userList = await firebase.getUserList();  // Using the existing instance of Firebase
            return userList; //array
        } catch (error) {
            console.error("Error fetching user list:", error);
            return [];  // Return empty list in case of error
        }
    }

    // Update user from admin
    async updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password) {
        try {
            const response = await firebase.updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password);
            return response;  // Return the response directly
        } catch (error) {
            console.error("Error updating user:", error);
            return { success: false, message: error.message || "Failed to update user." };
        }
    }

    

    // Searching for user by email (Admin)
    async searchUser(searchEmail) {
        try {
            const found = await firebase.searchUser(searchEmail);  // Fetch from FirebaseAuth
            return found;  // Return the first matched user

        } catch (err) {
            console.error("Error in userEntity searchUser:", err);
            throw new Error("Error in userEntity searchUser: " + err.message);
        }
    }

    // Admin delete user
    async suspendUser(userEmail) {
        

        try {
            const message = await firebase.suspendUser(userEmail);
            return message;

        } catch (error) {
            console.error("Error searching for category:", error);
            return { status: "error", message: error.message };
        }
    }
              

        
        }
        
        export default userEntity;
        
