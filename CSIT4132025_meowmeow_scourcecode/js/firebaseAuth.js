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
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Get user data from Firestore
            const usersData = collection(db, "csit314/AllUsers/UserData");
            const userDocRef = doc(usersData, user.email);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
    
                // Validate account type
                if (userData.userType !== selectedUserType) {
                    return { 
                        status: "error", 
                        message: `Incorrect account type. You registered as ${userData.userType}.`
                    };
                }
    
                // Return the user data upon successful login
                return { 
                    status: "success", 
                    message: "Login successful", 
                    userData 
                };
            } else {
                return { 
                    status: "error", 
                    message: "User not found in Firestore." 
                };
            }
        } catch (error) {
            console.error("Login failed:", error.code, error.message);
            let message;
            switch (error.code) {
                case "auth/user-not-found":
                    message = "No account found with this email.";
                    break;
                case "auth/wrong-password":
                    message = "Incorrect password. Please try again.";
                    break;
                case "auth/invalid-email":
                    message = "Invalid email format.";
                    break;
                case "auth/invalid-credential":
                    message = "Invalid email or password.";
                    break;
                default:
                    message = "Login failed. Please try again.";
            }
    
            return { 
                status: "error", 
                message 
            };
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
    
            // 1. Update Firestore
            try {
                const userRef = doc(this.db, "csit314/AllUsers/UserData", originalEmail);  // Assuming users are stored by email
                await updateDoc(userRef, {
                    firstName: firstName,
                    lastName: lastName,
                    email: newEmail,
                });
            } catch (error) {
                console.error("Error updating Firestore user:", error);
                throw new Error("Firestore update failed.");
            }
    
            // 2. Update Firebase Authentication (if email or password is updated)
            try {
                const currentUser = this.auth.currentUser;
    
                if (currentUser) {
                    if (newEmail && newEmail !== originalEmail) {
                        await updateEmail(currentUser, newEmail);  // Update email
                    }
    
                    if (password) {
                        await updatePassword(currentUser, password);  // Update password
                    }
                }
            } catch (error) {
                console.error("Error updating Firebase Authentication user:", error);
                throw new Error("Firebase Auth update failed.");
            }
    
            return { success: true, message: 'User updated successfully.' };
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
        // Using the Firebase instance for Firestore access
        // Inside FirebaseClass or wherever you're calling searchUser
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
    
    

        
        

}
