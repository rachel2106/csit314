import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import {getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
 } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

 import {getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where
 } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'


 const firebaseConfig = {
    apiKey: "AIzaSyDdXOWc5V451mFqdVVn0njYfUNLlEJNwzM",
    authDomain: "csit314meowmeow.firebaseapp.com",
    projectId: "csit314meowmeow",
    storageBucket: "csit314meowmeow.firebasestorage.com",
    messagingSenderId: "1071061611732",
    appId: "1:1071061611732:web:19e47778697d1056f43741",
    measurementId: "G-561HSJR7FB"
};

  const app = initializeApp(firebaseConfig);


  //Initialize cloud firestore and get a reference to the service
  const db = getFirestore(app);

  export const auth = getAuth(app);

  export default class Firebase {

    constructor() {
        this.db = db;
        this.auth = auth;
    }

    // Registration Function
    async registerUser(newUser) {
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth, // Firebase auth instance
                newUser.userEmail,
                newUser.userPass
            );
            const user = userCredential.user;

            // Log the Firebase user
            console.log("User successfully created in Firebase Auth:", user.email);

            // Now, add the user to Firestore (excluding password)
            const usersData = collection(db, "csit314/AllUsers/UserData");
            const userDocRef = doc(usersData, user.email); // Use user email as the document ID

            // Save user data to Firestore
            await setDoc(userDocRef, {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: user.email,
                password: newUser.userPass,
                userType: newUser.userType,
                userStatus: "Active",
            });

            console.log("User successfully added to Firestore:", user.email);


            //lead users back to login page
            window.location.href = "loginPage.html";

        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    }


    //Login for users
    async loginUser(email, password, selectedUserType) {
        try {
            const userCollection = collection(db, "csit314/AllUsers/UserData");
            const q = query(userCollection, where("email", "==", email));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                return { status: "error", message: "No user found with this email." };
            }
    
            const userData = querySnapshot.docs[0].data();
    
            // Compare the stored password
            if (userData.password !== password) {
                return { status: "error", message: "Incorrect password." };
            }
    
            if (userData.userType !== selectedUserType) {
                return { status: "error", message: `Incorrect account type. You registered as ${userData.userType}.` };
            }
    
            // Manual "authentication" successful
            return { status: "success", message: "Login successful", userData };
        } catch (error) {
            console.error("Login failed:", error.message);
            return { status: "error", message: "Login failed. Please try again." };
        }
    }



// Get list of all user emails (as IDs) and their statuses from UserData
    async getUserList() {
      try {
        const userCollection = collection(db, "csit314/AllUsers/UserData" );
        const querySnapshot = await getDocs(userCollection);
        const userList = [];
  
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          userList.push({
            userType: userData.userType,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            status: userData.userStatus
          });
        });
  
        return userList;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return [];
      }
    }

    //getting all profiles from firestore
    async getAllProfiles() {
        try {
            const collectionRef = collection(db, "csit314/AllUsers/UserData");
            const querySnapshot = await getDocs(collectionRef);
            const userTypesSet = new Set();
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userType) {
                    userTypesSet.add(data.userType);
                }
            });
    
            // Convert Set to Array of objects
            const userTypesList = Array.from(userTypesSet).map((type, index) => ({
                id: index,
                userType: type,
                userStatus: "Active" // or some placeholder if needed
            }));
    
            return userTypesList;
        } catch (error) {
            console.error("Error fetching unique user types:", error);
            return [];
        }
    }

    //search Profile
    async searchProfile(searchType) {
        try {
            // Create a query to filter by userType
            const qx = query(
                collection(db, "csit314/AllUsers/UserData"),
                where("userType", "==", searchType)
            );
    
            // Execute the query and get the snapshot
            const querySnapshot = await getDocs(qx);
            
            // Initialize an array to store user data
            let userList = [];
    
            // Loop through the query results
            querySnapshot.forEach((doc) => {
                userList.push(doc.data());
            });
    

            console.log("Found profiles:", userList);    // Return the user list (or you can return the list as a string or other format)
            return userList;
        } catch (error) {
            console.error("Error searching profiles:", error);
            return []; // Return an empty array if there's an error
        }
    }

        // Update user account by admin
        async updateUserAcc(updatedUser) {
            const { originalEmail, firstName, lastName, newEmail, password } = updatedUser;
        
            // Validate that the required fields are provided
            if (!originalEmail || !firstName || !lastName || !newEmail || !password) {
                console.error("Error: Missing required fields for user update.");
                return { success: false, message: "Missing required fields." };
            }
        
            try {
                console.log("Updating user data in Firestore:", updatedUser);
        
                // Reference to the Firestore document for the user
                const userRef = doc(this.db, "csit314/AllUsers/UserData", originalEmail);
                
                // Update only Firestore data (not Firebase Authentication)
                await updateDoc(userRef, {
                    firstName: firstName,
                    lastName: lastName,
                    email: newEmail,
                    password: password, // You may want to hash the password if storing it in Firestore
                });
        
                console.log("User data successfully updated in Firestore.");
        
                return { success: true, message: "User updated successfully in Firestore." };
            } catch (error) {
                console.error("Error updating Firestore user:", error);
                return { success: false, message: `Error updating Firestore user: ${error.message}` };
            }
        }



         // Create user account in Firebase Auth and Firestore
         async createUserByAdmin(newUser) {
            try {
                // Use lowercase userType values
                const validTypes = ["userAdmin", "platformManager", "cleaners", "homeowners"];
                const userTypeFormatted = newUser.userType.trim(); // Do not uppercase it
        
                if (!validTypes.includes(userTypeFormatted)) {
                    return {
                        status: "error",
                        message: `Invalid userType provided: ${newUser.userType}`
                    };
                }
        
                // Create user in Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(
                    this.auth,
                    newUser.userEmail,
                    newUser.userPass
                );
                const user = userCredential.user;
        
                // Store user in Firestore
                const userDocRef = doc(this.db, "csit314/AllUsers/UserData", user.email);
                await setDoc(userDocRef, {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: user.email,
                    password: newUser.userPass,
                    userType: userTypeFormatted,
                    userStatus: "Active"
                });
        
                return {
                    status: "success",
                    message: "User created successfully",
                    userEmail: user.email
                };
            } catch (error) {
                console.error("Firebase createUserByAdmin error:", error);
                return {
                    status: "error",
                    message: error.message
                };
            }
        }


        //searching for user based on email
        async searchUser(searchEmail) {
            try {
                const cleanedEmail = searchEmail.trim().toLowerCase();
                console.log("Searching Firestore for:", cleanedEmail);
    
                const qx = query(collection(db, "csit314/AllUsers/UserData"), where("email", "==", cleanedEmail));
                const querySnapshot = await getDocs(qx);
    
                console.log("Query Snapshot Size:", querySnapshot.size); // Debug log
    
                if (querySnapshot.empty) return null;
    
                return querySnapshot.docs.map(doc => doc.data()); // Return structured user data
            } catch (err) {
                console.error("Firestore error:", err);
                throw new Error("Error searching Firestore: " + err.message);
            }
        }
    

        //search by usertype for profile admin
        async searchProfileByUserType(userType) {
            try {
                const cleanedUserType = userType.trim().toLowerCase();
                const qx = query(
                    collection(db, "CSIT314/AllUsers/UserData"), // Correct Firestore path
                    where("userType", "==", cleanedUserType) // Search by userType
                );
        
                const querySnapshot = await getDocs(qx);
        
                if (querySnapshot.empty) {
                    console.warn("No profiles found for userType:", cleanedUserType);
                    return [];
                }
        
                return querySnapshot.docs.map(doc => doc.data()); // Return profile data
            } catch (err) {
                console.error("Firestore error:", err);
                throw new Error("Error searching Firestore by userType: " + err.message);
            }
        }

        //admin deleting user in admin page
        async deleteUser(userEmail) {
            try {
                // Get user document based on email
                const usersCollectionRef = collection(this.db, 'csit314/AllUsers/UserData');
                const q = query(usersCollectionRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
        
                if (querySnapshot.empty) {
                    throw new Error("No user found with this email.");
                }
        
                // Correct way: use for...of to await each deleteDoc
                for (const docSnap of querySnapshot.docs) {
                    await deleteDoc(docSnap.ref);
                    console.log(`Deleted Firestore document for email: ${userEmail}`);
                }
        
                return { success: true };
            } catch (error) {
                console.error("Error deleting Firestore user:", error);
                throw error;
            }
        }
        


        // Update user account by admin (Firestore update)
        async updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password) {
            const cleanedEmail = originalEmail.trim().toLowerCase();  
            const userCollection = collection(db, "csit314/AllUsers/UserData"); 
        
            // Query Firestore by email instead of assuming it's the document ID
            const q = query(userCollection, where("email", "==", cleanedEmail));
            const querySnapshot = await getDocs(q);
        
            if (querySnapshot.empty) {
                console.error("No user found with email:", cleanedEmail);
                return { status: "error", message: "User not found in Firestore." };
            } 
        
            // Get the first matching document
            const userDoc = querySnapshot.docs[0];
            console.log("User document found:", userDoc.data());
        
            // Get the document reference for updating
            const userRef = userDoc.ref;
        
            try {
                const updatedData = {
                    firstName: firstName,
                    lastName: lastName,
                    email: newEmail,
                    password: password,
                };
        
                await updateDoc(userRef, updatedData);
                console.log("User updated successfully in Firestore");
        
                return { status: "success", message: "User updated successfully." };
            } catch (error) {
                console.error("Error updating Firestore user:", error);
                return { status: "error", message: "Error updating user in Firestore." };
            }
        }

        // inside Firebase class
    async updateUserAuth(newEmail, newPassword) {
    const user = this.auth.currentUser;
    try {
        if (newEmail) {
            await updateEmail(user, newEmail);
            console.log("Email updated successfully in Firebase Auth.");
        }
        if (newPassword) {
            await updatePassword(user, newPassword);
            console.log("Password updated successfully in Firebase Auth.");
        }
    } catch (error) {
        console.error("Error updating Firebase Auth:", error);
        throw error;
    }
}
        
    }
    export {db, Firebase}
      

