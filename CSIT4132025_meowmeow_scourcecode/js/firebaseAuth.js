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
    where,
    serverTimestamp
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

  const auth = getAuth(app);

  export default class Firebase {

    constructor() {
        this.db = db;
        this.auth = auth;
    }

    // // Registration Function
    // async registerUser(newUser) {
    //     try {
    //         // Create user in Firebase Authentication
    //         const userCredential = await createUserWithEmailAndPassword(
    //             auth, // Firebase auth instance
    //             newUser.userEmail,
    //             newUser.userPass
    //         );
    //         const user = userCredential.user;
    
    //         // Log the Firebase user
    //         console.log("User successfully created in Firebase Auth:", user.email);
    
    //         // Now, add the user to Firestore (excluding password)
    //         const usersData = collection(db, "csit314/AllUsers/UserData");
    //         const userDocRef = doc(usersData, user.email); // Use user email as the document ID
    
    //         // Save user data to Firestore
    //         await setDoc(userDocRef, {
    //             firstName: newUser.firstName,
    //             lastName: newUser.lastName,
    //             email: user.email,
    //             password: newUser.userPass,
    //             userType: newUser.userType,
    //             userStatus: "Active",
    //         });
    
    //         console.log("User successfully added to Firestore:", user.email);
    
    //         // Lead users back to login page
    //         window.location.href = "loginPage.html";
    
    //     } catch (error) {
    //         console.error("Error during registration:", error);
    //         alert("Registration failed. Please try again.");
    //     }
    // }


    // //Login for users
    // async loginUser(email, password, userType) {
    //     try {
    //         const usersCollection = collection(db, "csit314/AllUsers/UserData");
    //         const q = query(usersCollection, where("email", "==", email), where("userType", "==", userType));
    //         const querySnapshot = await getDocs(q);
    
    //         if (querySnapshot.empty) {
    //             return { status: "error", message: "No user found with this email and profile." };
    //         }
    
    //         const userDoc = querySnapshot.docs[0];
    //         const userData = userDoc.data();
    
    //         console.log("Fetched User Data:", userData); // Debugging output for user data

        
    
    //         // Simple password check (plain-text example, consider hashing passwords in production)
    //         if (userData.password === password) {
    //             return { status: "success", userData };
    //         } else {
    //             return { status: "error", message: "Incorrect password." };
    //         }
    //     } catch (err) {
    //         console.error("Error during login:", err.message);
    //         throw new Error("Login failed.");
    //     }
    // }

    // User Account CRUDS 
    // Create user account in Firebase Auth and Firestore
    async createUser(newUser) {
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
    
            // Check if user already exists in Firestore based on email
            const userCollectionRef = collection(this.db, "csit314/AllUsers/UserData");
            const q = query(userCollectionRef, where("email", "==", newUser.userEmail));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                // If email exists, allow duplicate by creating a new unique document ID
                const timestamp = new Date().getTime(); // Create a unique timestamp
                const userDocRef = doc(this.db, "csit314/AllUsers/UserData", `user_${timestamp}`);
    
                // Store the user in Firestore
                await setDoc(userDocRef, {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.userEmail, // Keep the email
                    password: newUser.userPass, // Store password (consider hashing it)
                    userType: userTypeFormatted,
                    userStatus: "Active"
                });
    
                // also a success - allows duplicate email
                return {
                    status: "success", //string
                    message: "User created successfully with duplicate email allowed.", //string
                };
            } else {
                // If email doesn't exist, create the user with email as the document ID
                const userDocRef = doc(this.db, "csit314/AllUsers/UserData", newUser.userEmail);
                await setDoc(userDocRef, {
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.userEmail,
                    password: newUser.userPass, // Store password (consider hashing it)
                    userType: userTypeFormatted,
                    userStatus: "Active"
                });
    
                //success - new email
                return {
                    status: "success", //string
                    message: "User created successfully" //string
                };
            }
        } catch (error) {
            console.error("Error creating user in Firestore:", error);
            return {
                status: "error", //string
                message: error.message //string
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
  
        return userList; //array
      } catch (error) {
        console.error("Error fetching user data:", error);
        return []; //array
      }
    }

    // Update user account by admin (Firestore update)
    async updateUserInFirestore({originalEmail, firstName, lastName, newEmail, password}) {
        const cleanedEmail = originalEmail.trim().toLowerCase();  
        const userCollection = collection(db, "csit314/AllUsers/UserData"); 
        let message = "";

        // if (!originalEmail || !firstName || !lastName || !newEmail || !password) {
        //     console.error("Error: Missing required fields for user update.");
        //     message = "failed"
        //     // return { success: false, message: "Missing required fields." };
        //     return message;
        // }
    
        // Query Firestore by email instead of assuming it's the document ID
        // const q = query(userCollection, where("email", "==", originalEmail));
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
            message = true;

            return message; //bool
            // return { status: "success", message: "User updated successfully." };
        } catch (error) {
            console.error("Error updating Firestore user:", error);
            return { status: "error", message: "Error updating user in Firestore." };
        }
    }

    //admin suspend user in admin page
    async suspendUser(userEmail){
        let message = "";
        try{
            // Get user document based on email
            const userRef = doc(this.db, "csit314/AllUsers/UserData", userEmail);
            
            
            const usersCollectionRef = collection(this.db, 'csit314/AllUsers/UserData');
            const q = query(usersCollectionRef, where('email', '==', userEmail));
            const querySnapshot = await getDocs(q);

            // if (querySnapshot.empty) {
            //     throw new Error("No user found with this email.");
            // }

            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();

            if( userData.userStatus === "Active"){
                await updateDoc(userRef, {
                    userStatus: "Inactive"
                });
                message = "suspended";
            }else{
                await updateDoc(userRef, {
                    userStatus: "Active"
                });
                message = "Unsuspended";
            }

            return message; //string
        }catch (err){
            message = "Error to suspend";
            return message; //string
        }
    }

    //searching for user based on email
    async searchUser(searchEmail) {
        try {
            const cleanedEmail = searchEmail.trim().toLowerCase();
            console.log("Searching Firestore for:", cleanedEmail);

            const qx = query(
                collection(db, "csit314/AllUsers/UserData"),
                 where("email", "==", cleanedEmail)
            );
            const querySnapshot = await getDocs(qx);

            console.log("Query Snapshot Size:", querySnapshot.size); // Debug log

            if (querySnapshot.empty) return null;

            const result = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (!result || result.length === 0) {
                console.warn("No user found with email:", searchEmail);
                return null;  // Ensure it returns null if no user is found
            }

            const found = result[0];

            // querySnapshot.docs.map(doc => doc.data()); // Return structured user data


            return found; // obj
        } catch (err) {
            console.error("Firestore error:", err);
            throw new Error("Error searching Firestore: " + err.message);
        }
    }



    // User Profile CRUDS
    // Create New User Profile
    async createProfile(profileData) {
        try {
            const {userType, description} = profileData;

            // Validate profile
            if (!userType || typeof userType !== "string" || userType.trim() === "") {
                return {
                    status: "error", //string
                    message: "Invalid or missing profile" //string
                };
            }


            await addDoc(collection(db, "csit314/AllUsers/UserData"), {
                userType: userType.trim(),
                description : description.trim(),
                createdDate: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                profileStatus: "Active"
            });

            return {
                status: "success", //string
                message: "Profile Created" //string
            };
        } catch (error) {
            return{
                status: "error", //string
                message: error //string
            }
            // Do nothing on error
        }
    }

    //getting all profiles from firestore
    async getAllProfiles() {
        try {
            const querySnapshot = await getDocs(collection(db, "csit314/AllUsers/UserData"));

            const userList = [];

            querySnapshot.forEach(doc => {
                const userData = doc.data();
                userList.push({
                    userType: userData.userType,
                    description: userData.description,
                    profileStatus: userData.profileStatus,
                    // firstName: userData.firstName,
                    // lastName: userData.lastName,
                    // email: userData.email,
                    // status: userData.userStatus
                });
            });

        return userList; //array
        } catch (error) {
            console.error("Error fetching unique user types:", error);
            return [];
        }
    }

    //update Profile

    async updateUserTypeDescription(userType, newDescription) {
        try {
            let message = "";
            const q = query(collection(db, "csit314/AllUsers/UserData"), where("userType", "==", userType));
            const snapshot = await getDocs(q);


            if (!snapshot.empty) {
                const updatePromises = snapshot.docs.map(docSnap =>
                    updateDoc(docSnap.ref, {
                        description: newDescription.trim(),
                        lastUpdated: serverTimestamp()
                    })
                );
    
                await Promise.all(updatePromises); // Wait for all updates to finish
                message = "Update successful"; //string
            
            }
            return message;
        } catch (error) {
            // Do nothing on error
        }
    }


    //search Profile
    async searchProfile(searchType) {
        try {
            const q = query(
                collection(db, "csit314/AllUsers/UserData"),
                where("userType", "==", searchType)
            );
            const querySnapshot = await getDocs(q);
    
            const userList = [];
            
            querySnapshot.forEach(doc => {
                userList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
    
            return userList; //array
        } catch (error) {
            console.error("Error searching profiles:", error);
            return []; // Return empty array on failure
        }
    }

     // admin suspend user in admin page
     async suspendProfile(userType) {
        let message = "";
        try {
            const usersCollectionRef = collection(this.db, 'csit314/AllUsers/UserData');
            const q = query(usersCollectionRef, where('userType', '==', userType));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("No users found with this user type.");
            }

            for (const docSnapshot of querySnapshot.docs) {
                const userData = docSnapshot.data();
                const currentStatus = userData.profileStatus;
                const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

                const userRef = doc(this.db, 'csit314/AllUsers/UserData', docSnapshot.id);
                await updateDoc(userRef, {
                    profileStatus: newStatus
                });

                console.log(`User ${docSnapshot.id} status changed to ${newStatus}`);
            }

            message = "Users updated successfully."; // string
        } catch (err) {
            console.error("Error suspending profiles:", err);
            message = "Error updating user statuses."; //string
        }

        return message;
    }
    
    

        // // Update user account by admin
        // async updateUserAcc(updatedUser) {
        //     const { originalEmail, firstName, lastName, newEmail, password } = updatedUser;
        
        //     // Validate that the required fields are provided
        //     if (!originalEmail || !firstName || !lastName || !newEmail || !password) {
        //         console.error("Error: Missing required fields for user update.");
        //         return { success: false, message: "Missing required fields." };
        //     }
        
        //     try {
        //         console.log("Updating user data in Firestore:", updatedUser);
        
        //         // Reference to the Firestore document for the user
        //         const userRef = doc(this.db, "csit314/AllUsers/UserData", originalEmail);
                
        //         // Update only Firestore data (not Firebase Authentication)
        //         await updateDoc(userRef, {
        //             firstName: firstName,
        //             lastName: lastName,
        //             email: newEmail,
        //             password: password, // You may want to hash the password if storing it in Firestore
        //         });
        
        //         console.log("User data successfully updated in Firestore.");
        
        //         return { success: true, message: "User updated successfully in Firestore." };
        //     } catch (error) {
        //         console.error("Error updating Firestore user:", error);
        //         return { success: false, message: `Error updating Firestore user: ${error.message}` };
        //     }
        // }



         
        


        
    

        // //search by usertype for profile admin
        // async searchProfileByUserType(userType) {
        //     try {
        //         const cleanedUserType = userType.trim().toLowerCase();
        //         const qx = query(
        //             collection(db, "CSIT314/AllUsers/UserData"), // Correct Firestore path
        //             where("userType", "==", cleanedUserType) // Search by userType
        //         );
        
        //         const querySnapshot = await getDocs(qx);
        
        //         if (querySnapshot.empty) {
        //             console.warn("No profiles found for userType:", cleanedUserType);
        //             return [];
        //         }
        
        //         return querySnapshot.docs.map(doc => doc.data()); // Return profile data
        //     } catch (err) {
        //         console.error("Firestore error:", err);
        //         throw new Error("Error searching Firestore by userType: " + err.message);
        //     }
        // }

        
        

        //  async suspendProfile(userType){
        //     let message = "";
        //     try{
        //         // Get user document based on email
        //         const userRef = doc(this.db, "csit314/AllUsers/UserData", userType);
                
                
        //         const usersCollectionRef = collection(this.db, 'csit314/AllUsers/UserData');
        //         const q = query(usersCollectionRef, where('userType', '==', userType));
        //         const querySnapshot = await getDocs(q);

        //         // if (querySnapshot.empty) {
        //         //     throw new Error("No user found with this email.");
        //         // }

        //         const userDoc = querySnapshot.docs[0];
        //         const userData = userDoc.data();

        //         if (!querySnapshot.empty) {
        //             querySnapshot.forEach(async (docSnapshot) => {
        //                 if( userData.profileStatus === "Active"){
        //                     await updateDoc(userRef, {
        //                         profileStatus: "Inactive"
        //                     });
        //                     message = "suspended";
        //                 }else{
        //                     await updateDoc(userRef, {
        //                         profileStatus: "Active"
        //                     });
        //                     message = "Unsuspended";
        //                 }
        //             });
        //         }

                
        //         return message;
        //     }catch (err){
        //         message = "Error to suspend";
        //         return message;
        //     }
        // }


        // //admin deleting user in admin page
        // async deleteUser(userEmail) {
        //     try {
        //         // Get user document based on email
        //         const usersCollectionRef = collection(this.db, 'csit314/AllUsers/UserData');
        //         const q = query(usersCollectionRef, where('email', '==', userEmail));
        //         const querySnapshot = await getDocs(q);
        
        //         if (querySnapshot.empty) {
        //             throw new Error("No user found with this email.");
        //         }
        
        //         // Correct way: use for...of to await each deleteDoc
        //         for (const docSnap of querySnapshot.docs) {
        //             await deleteDoc(docSnap.ref);
        //             console.log(`Deleted Firestore document for email: ${userEmail}`);
        //         }
        
        //         return { success: true };
        //     } catch (error) {
        //         console.error("Error deleting Firestore user:", error);
        //         throw error;
        //     }
        // }


        
        // // Create new profile in Firestore
        // async createNewProfile(newUser) {
        //     try {
        //         // Define valid user types
        //         const validTypes = ["userAdmin", "platformManager", "cleaners", "homeowners"];
        //         const userTypeFormatted = newUser.userType.trim().toLowerCase(); // Ensure lowercase type

        //         // Check if the userType is valid
        //         if (!validTypes.includes(userTypeFormatted)) {
        //             return {
        //                 status: "error",
        //                 message: `Invalid userType provided: ${newUser.userType}`
        //             };
        //         }

        //         // Check if user already exists in Firestore based on email
        //         const userCollectionRef = collection(this.db, "csit314/AllUsers/UserData");
        //         const q = query(userCollectionRef, where("email", "==", newUser.userEmail));
        //         const querySnapshot = await getDocs(q);

        //         // If user already exists, return an error
        //         if (!querySnapshot.empty) {
        //             return {
        //                 status: "error",
        //                 message: "A user with this email already exists."
        //             };
        //         }

        //         // If email doesn't exist, create the user profile in Firestore
        //         const userDocRef = doc(userCollectionRef, newUser.userEmail);
        //         await setDoc(userDocRef, {
        //             firstName: newUser.firstName,
        //             lastName: newUser.lastName,
        //             email: newUser.userEmail,
        //             password: newUser.userPass, // Consider hashing passwords in production
        //             userType: userTypeFormatted,
        //             userStatus: "Active"
        //         });

        //         return {
        //             status: "success",
        //             message: "Profile created successfully",
        //             userEmail: newUser.userEmail
        //         };
        //     } catch (error) {
        //         console.error("Error creating new profile in Firestore:", error);
        //         return {
        //             status: "error",
        //             message: error.message
        //         };
        //     }
        // }

        

        // // inside Firebase class
        // async updateUserAcc(updatedUser) {
        //     const { originalEmail, firstName, lastName, newEmail, password } = updatedUser;
        
        //     // Validate that the required fields are provided
        //     if (!originalEmail || !firstName || !lastName || !newEmail || !password) {
        //         console.error("Error: Missing required fields for user update.");
        //         return { success: false, message: "Missing required fields." };
        //     }
        
        //     try {
        //         console.log("Updating user data in Firestore:", updatedUser);
        
        //         // Reference to the Firestore document for the user
        //         const userRef = doc(this.db, "csit314/AllUsers/UserData", originalEmail);
                
        //         // Update only Firestore data (not Firebase Authentication)
        //         await updateDoc(userRef, {
        //             firstName: firstName,
        //             lastName: lastName,
        //             email: newEmail,
        //             password: password, // You may want to hash the password if storing it in Firestore
        //         });
        
        //         console.log("User data successfully updated in Firestore.");  
        
        //         // Refresh the page after the update
        //         window.location.reload();
        
        //         return { success: true, message: "User updated successfully in Firestore." };
        //     } catch (error) {
        //         console.error("Error updating Firestore user:", error);
        //         return { success: false, message: `Error updating Firestore user: ${error.message}` };
        //     }
        // }
        




    // Platform Manager Functions
    // Generate Report Daily, Weekly, Monthly
    async getDailyReport (dailyData){
        try{
            const { start, end } = dailyData;
            const categoriesSnap = await getDocs(collection(this.db, "csit314/AllServiceCategory/CleaningServiceData"));
            let groupedServices = {};

            for (const catDoc of categoriesSnap.docs){
                const catName = catDoc.id;

                const listingRef = collection(this.db, `csit314/AllServiceCategory/CleaningServiceData/${catName}/serviceListings`);
                const q = query(
                    listingRef, 
                    where("createdAt", ">=", start),
                    where("createdAt", "<", end)
                );

                const listingSnap = await getDocs(q);
                let listings = [];
                let uniqueCleaner = new Set();

                listingSnap.forEach(doc => {
                    const data = doc.data();
                    listings.push({
                        listingId: doc.id,
                        ...data
                    });

                    if (data.createdBy) {
                        uniqueCleaner.add(data.createdBy);
                    }
                });

                if (listings.length > 0) {
                    groupedServices[catName] = {
                        totalListings: listings.length,
                        totalCleaners: uniqueCleaner.size,
                        listings: listings
                    };
                }

            }
            const report = {
                status: "success", //string
                timeframe: start.toDateString(), //string
                report : groupedServices //object
            }


            return report; //obj
        } catch (error){
            console.error("Error generating daily report:", error);
            return {
                status: "error", //string
                message: error.message //string
            };
        }
    }

    async getWeeklyReport(){
        try{
            const now = new Date();
            const start = new Date(now);

            // Set the date "start" to Sunday
            start.setDate(now.getDate() - now.getDay());
            start.setHours(0,0,0,0);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);

            const categoriesSnap = await getDocs(collection(this.db, "csit314/AllServiceCategory/CleaningServiceData"));
            let groupedServices = {};

            for (const catDoc of categoriesSnap.docs){
                const catName = catDoc.id;

                const listingRef = collection(this.db, `csit314/AllServiceCategory/CleaningServiceData/${catName}/serviceListings`);
                const q = query(
                    listingRef, 
                    where("createdAt", ">=", start),
                    where("createdAt", "<", end)
                );

                const listingSnap = await getDocs(q);
                let listings = [];
                let uniqueCleaner = new Set();

                listingSnap.forEach(doc => {
                    const data = doc.data();
                    listings.push({
                        listingId: doc.id,
                        ...data
                    });

                    if (data.createdBy) {
                        uniqueCleaner.add(data.createdBy);
                    }
                });

                if (listings.length > 0) {
                    groupedServices[catName] = {
                        totalListings: listings.length,
                        totalCleaners: uniqueCleaner.size,
                        listings: listings
                    };
                }

            }

            const report = {
                status: "success", //string
                timeframe: `${start.toDateString()} to ${end.toDateString()}`, //string
                report : groupedServices //object
            }
            return report; //obj
        } catch (error){
            console.error("Error generating daily report:", error);
            return {
                status: "error", //string
                message: error.message //string
            };
        }
    }

    async getMonthlyReport (monthlyData){
        try{
            const [year, month ] = monthlyData.split('-').map(Number);

            const start = new Date( year, month-1, 1); // month from data is 1-12, but in Date() is 0-11
            const end = new Date(year, month, 1); //next month

            const categoriesSnap = await getDocs(collection(this.db, "csit314/AllServiceCategory/CleaningServiceData"));
            let groupedServices = {};

            for (const catDoc of categoriesSnap.docs){
                const catName = catDoc.id;

                const listingRef = collection(this.db, `csit314/AllServiceCategory/CleaningServiceData/${catName}/serviceListings`);
                const q = query(
                    listingRef, 
                    where("createdAt", ">=", start),
                    where("createdAt", "<", end)
                );

                const listingSnap = await getDocs(q);
                let listings = [];
                let uniqueCleaner = new Set();

                listingSnap.forEach(doc => {
                    const data = doc.data();
                    listings.push({
                        listingId: doc.id,
                        ...data
                    });

                    if (data.createdBy) {
                        uniqueCleaner.add(data.createdBy);
                    }
                });

                if (listings.length > 0) {
                    groupedServices[catName] = {
                        totalListings: listings.length,
                        totalCleaners: uniqueCleaner.size,
                        listings: listings
                    };
                }

            }

            const report = {
                status: "success",
                timeframe: monthlyData, 
                report : groupedServices
            }
            return report; //obj
        } catch (error){
            console.error("Error generating monthly report:", error);

            return {
                status: "error",
                message: error.message
            };
        }
    }
    // Create a new service category (used by Platform Manager)
    async createServiceCategory(categoryData) {
        try {
            const { serviceCategory, description, currentUserEmail  } = categoryData;

            // Validate name
            if (!serviceCategory || typeof serviceCategory !== "string" || serviceCategory.trim() === "") {
                return {
                    status: "error",
                    message: "Invalid or missing category name"
                };
            }

            const categoryRef = collection(this.db, "csit314/AllServiceCategory/CleaningServiceData");

            // Optional: Check if category already exists
            const q = query(categoryRef, where("serviceCategory", "==", serviceCategory.trim()));
            const existing = await getDocs(q);
            if (!existing.empty) {
                return {
                    status: "error",
                    message: "Category with this name already exists"
                };
            }

            const categoryDocRef = doc(this.db, "csit314/AllServiceCategory/CleaningServiceData", `${categoryData.serviceCategory}`);
            const normalizedNaming = serviceCategory.toLowerCase().replace(/\s+/g, '');

            // const categoryDocRef = 
            await setDoc(categoryDocRef, {
                serviceCategory: serviceCategory.trim(),
                normalizedCategory: normalizedNaming.trim(),
                description: description?.trim() || "",
                createdAt: serverTimestamp(),
                createdBy: currentUserEmail,
                numOfServices: 0, //number of sevices created in each category
                numCleaner: 0, //number of cleaner having each of category
                numHomeowner: 0 //number of homeowner uses the service in that category
            });

            return {
                status: "success", //string
                message: "Service category created successfully" //string
            };
        } catch (error) {
            console.error("Error creating service category:", error);
            return {
                status: "error", //string
                message: error.message //string
            };
        }
    }

    // View all service categories
    async getCategoryList() {
        try {
            const categoryCollection = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
            const snapshot = await getDocs(categoryCollection);
            const categoryList = [];

            snapshot.forEach(doc => {
                const serviceData = doc.data();
                categoryList.push({
                    id: doc.id,
                    serviceCategory: serviceData.serviceCategory,
                    description: serviceData.description,
                    createdAt: serviceData.createdAt?.toDate?.() || null,
                    createdBy: serviceData.createdBy

                });
            });


            return categoryList; // array
        } catch (error) {
            console.error("Error fetching service categories:", error);
            return [];
            // return {
            //     status: "error",
            //     message: error.message
            // };
        }
    }
    
   
    

    async updateServiceCategory(updatedCategoryData){ 
        const {categoryId, serviceCategory, description } = updatedCategoryData;

        // Validate required category
        console.log("originalCategory:", categoryId);
        console.log("serviceCategory:", serviceCategory);
        console.log("description:", description);

        if (!categoryId || !serviceCategory || !description) {
            console.error("Error: Missing required fields for user update.");
            return {success: false, message: "Missing required fields!"};

        }

        try{
            console.log("Updating service data in Firestore:", updatedCategoryData);

            // Reference to the Firestore document for the user
            const categoryRef = doc(this.db, "csit314/AllServiceCategory/CleaningServiceData", categoryId);

            // Update only Firestore data (not Firebase Authentication)
           
            await updateDoc(categoryRef, {
                serviceCategory: serviceCategory.trim(),
                description: description.trim()
            });



            // Refresh the page after the update
            // window.location.reload(); 

            return { 
                success: true, //boolean
                message: "Service category updated" //string
            };
        } catch (error) {
            console.error("Error updating service category:", error);
            return { success: false, message: `Error updating category:${error.message}` };
        }
    }

    async deleteServiceCategory(deleteCategoryData){
        try {
            // Get user document based on email
            const categoryRef = collection(this.db, "csit314/AllServiceCategory/CleaningServiceData");
            const q = query(categoryRef, where('serviceCategory', '==', deleteCategoryData));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                throw new Error("No user found with this email.");
            }
    
            // Correct way: use for...of to await each deleteDoc
            for (const docSnap of querySnapshot.docs) {
                await deleteDoc(docSnap.ref);
                // console.log(`Deleted Firestore document for service category: ${deleteCategoryData}`);
            }
    
            return { success: true }; //boolean
        } catch (error) {
            console.error("Error deleting Firestore service category:", error);
            throw error;
        }

    }

    async searchServiceCategory(searchCategoryData){
        try{
            const categoryRef = collection(this.db, "csit314/AllServiceCategory/CleaningServiceData");
            const searchData = searchCategoryData.toLowerCase().replace(/\s+/g, '');
            const q = query(categoryRef, where("normalizedCategory", "==", searchData.trim()));
            const snapshot = await getDocs(q);
            const categoryList = [];

            snapshot.docs.map(doc => {
                const serviceData = doc.data();
                categoryList.push({
                    id: doc.id,
                    serviceCategory: serviceData.serviceCategory,
                    description: serviceData.description,
                    createdAt: serviceData.createdAt?.toDate?.() || null

                });
            });


            return categoryList; // array
        }catch (error){
            console.error("Error deleting Firestore user:", error);
            throw error;
        }
   
    }

    // Cleaner Functions
    // Create a new service listing (used by Cleaner)
    async createServiceListing(listingData) {
        try {
            const { serviceListing, serviceCategory, frequency, fee, details,listStatus, currentUserEmail  } = listingData;
            console.log("This is frequency " + frequency)


            // Validate name
            if (!serviceListing || !serviceCategory || !frequency || !fee || !details || !listStatus || !currentUserEmail) {
                console.error("Missing required fields:", listingData);
                return {
                    status: "error",
                    message: "Missing required fields" + serviceListing + serviceCategory + frequency +fee + listStatus + details + currentUserEmail
                 };
            }

            const categoryDocRef = doc(this.db, "csit314/AllServiceCategory/CleaningServiceData", serviceCategory);

            // Optional: Check if category already exists
            const catSnap = await getDoc(categoryDocRef);
            if (!catSnap.exists()) {
                console.error(`Category "${serviceCategory}" does not exist.`);
                return {
                    status: "error",
                    message: "Category does not exist"
                };
            }

            const listingId = serviceListing.toLowerCase().replace(/\s+/g, "_");

            const listingDocRef = doc(this.db, "csit314/AllServiceCategory/CleaningServiceData", serviceCategory, "serviceListings", listingId);
            const normalizedNaming = serviceListing.toLowerCase().replace(/\s+/g, '');

            // const categoryDocRef = 
            await setDoc(listingDocRef , {
                listingName: serviceListing.trim(),
                normalizedListing: normalizedNaming,
                fee: parseFloat(fee),
                details: details.trim(),
                createdBy: currentUserEmail,
                createdAt: serverTimestamp(),
                category: serviceCategory.trim(),
                listingFrequency: frequency.trim(),
                listStatus: listStatus.trim(),
                viewCount: 0,
                viewShortlisted: 0,

            });

            // check if this cleaner is already counted in the category
            const cleanerTrackerRef = doc(this.db, `csit314/AllServiceCategory/CleaningServiceData/${serviceCategory}/cleanerTrackers/${currentUserEmail}`);
            const cleanerSnap = await getDoc(cleanerTrackerRef);

            let updateData = { numOfServices: (catSnap.data().numOfServices || 0) + 1 };

            if (!cleanerSnap.exists()) {
                // First time this cleaner is adding to this category
                updateData.numCleaner = (catSnap.data().numCleaner || 0) + 1;

                // Create a marker document to track this cleaner
                await setDoc(cleanerTrackerRef, { email: currentUserEmail, timestamp: Date.now() });
            }

            // Update the category document
            await updateDoc(categoryDocRef, updateData);


            console.log("Service listing successfully created!");


            return {
                status: "success", //string
                message: "Listing created!" //string
            };

        } catch (error) {
            console.error("Error creating service listing:", error);
            return {
                status: "error",
                message: error.message
            };
        }
    }

    // View all service categories
    async getListingList(cleanerEmail) {
        try {
            const categoriesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
            const categorySnapshots = await getDocs(categoriesRef);
    
            const cleanerListings = [];
    
            for (const categoryDoc of categorySnapshots.docs) {
                const categoryId = categoryDoc.id;
    
                const listingsRef = collection(
                    db,
                    `csit314/AllServiceCategory/CleaningServiceData/${categoryId}/serviceListings` // 🔁 Fixed here
                );
                const listingSnapshots = await getDocs(listingsRef);
    
                listingSnapshots.forEach(listingDoc => {
                    const data = listingDoc.data();
                    if (data.createdBy === cleanerEmail) {
                        cleanerListings.push({
                            id: listingDoc.id,
                            category: categoryId,
                            ...data
                        });
                    }
                });
            }
    
            return cleanerListings; //array
    
        } catch (error) {
            console.error("Error fetching listings by cleaner email:", error);
            return [];
        }
    }

    async updateServiceListing(updatedListingData){ 
        const {listingId, serviceCategory, listingName, listingFrequency, fee,  details, listStatus, createdBy } = updatedListingData;

        // Validate required category
        console.log("originalListing:", listingId);
        console.log("serviceListing:", listingName);
        console.log("frequency:", listingFrequency);
        console.log("fee:", fee);
        console.log("status", listStatus);
        console.log("details:", details);

        if (!listingId || !serviceCategory || !listingName || !listingFrequency || !fee || !listStatus || !details) {
            console.error("Error: Missing required fields for user update."); 
            return {success: false, message: "Missing required fields!"};

        }

        try{
            console.log("Updating service data in Firestore:", updatedListingData);

            // Reference to the Firestore document for the user
            const listingRef = doc(this.db, `csit314/AllServiceCategory/CleaningServiceData/${serviceCategory}/serviceListings`, listingId);
            const listingSnap = await getDoc(listingRef);

            if (!listingSnap.exists()) {
                return { success: false, message: "Listing not found." };
            }

            const listingData = listingSnap.data();
            if (listingData.createdBy !== createdBy) {
                return { success: false, message: "Unauthorized: You can only update your own listings." };
            }
            // Update only Firestore data (not Firebase Authentication)

           
            await updateDoc(listingRef, {
                listingName: listingName.trim(),
                fee: parseFloat(fee),
                details: details.trim(),
                listingFrequency: listingFrequency.trim(),
                listStatus: listStatus.trim()
            });

            return { 
                success: true, //boolean
                message: "Service Listing updated" //string
            };
        } catch (error) {
            console.error("Error updating service listing:", error);
            return { success: false, message: `Error updating listing:${error.message}` };
        }
    }

    async deleteServiceListing(deleteListingData){
        try {
            const {listingName, serviceCategory, createdBy } = deleteListingData;
            // Get user document based on email
            const categoryRef = collection(this.db, `csit314/AllServiceCategory/CleaningServiceData/${serviceCategory}/serviceListings`);

            const q = query(categoryRef, where('listingName', '==', listingName), where('createdBy', '==', createdBy));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                throw new Error("No user found with this email.");
            }
    
            // Correct way: use for...of to await each deleteDoc
            for (const docSnap of querySnapshot.docs) {
                await deleteDoc(docSnap.ref);
            }
    
            return { success: true };
        } catch (error) {
            console.error("Error deleting Firestore service listing:", error);
            throw error;
        }

    }

    async searchServiceListing(searchListingData){
        try{
            const {listingName, createdBy } = searchListingData;

            const categoriesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
            const categorySnapshots = await getDocs(categoriesRef);
            const listingList = [];
            
    

            for (const categoryDoc of categorySnapshots.docs) {
                const categoryId = categoryDoc.id;
    
                const listingsRef = collection(
                    db,
                    `csit314/AllServiceCategory/CleaningServiceData/${categoryId}/serviceListings` // 🔁 Fixed here
                );
                const searchData = listingName.toLowerCase().replace(/\s+/g, '');
                const q = query(listingsRef, where("normalizedListing", "==", searchData.trim()), where('createdBy', '==', createdBy));
                const snapshot = await getDocs(q);
                

                snapshot.docs.map(doc => {
                    const serviceData = doc.data();
                    listingList.push({
                        id: doc.id,
                        category: serviceData.category,
                        listingName: serviceData.listingName,
                        viewCount: serviceData.viewCount,
                        viewShortlisted: serviceData.viewShortlisted,

                    });
                });
            }


            return listingList; //array
        }catch (error){
            console.error("Error deleting Firestore user:", error);
            throw error;
        }
    }

    //View Booking History List




//Homeowner
// Fetch all service listings from all categories
    async fetchAllServiceListings() {
    const basePath = "csit314/AllServiceCategory/CleaningServiceData";
    const categoriesCol = collection(this.db, basePath);
    const categoryDocs = await getDocs(categoriesCol);

    const allServices = [];

    for (const categoryDoc of categoryDocs.docs) {
        const categoryName = categoryDoc.id;
        const listingsPath = `${basePath}/${categoryName}/serviceListings`;
        const listingsCol = collection(this.db, listingsPath);
        const listingsSnap = await getDocs(listingsCol);

        listingsSnap.forEach(doc => {
        allServices.push({
            id: doc.id,
            ...doc.data(),
            serviceCategory: categoryName,
        });
        });
    }

    return allServices;
    }

    // Fetch filtered cleaning services
    async getFilteredCleaningServices({ category, price, status }) {
        const basePath = "csit314/AllServiceCategory/CleaningServiceData";
        const categoriesCol = collection(this.db, basePath);
        const categoryDocs = await getDocs(categoriesCol);

        const allServices = [];

        for (const categoryDoc of categoryDocs.docs) {
            const categoryName = categoryDoc.id;

            if (category && category !== categoryName) continue;

            const listingsPath = `${basePath}/${categoryName}/serviceListings`;
            const listingsCol = collection(this.db, listingsPath);
            const listingsSnap = await getDocs(listingsCol);

            listingsSnap.forEach(doc => {
            const data = doc.data();

            if (status && data.listStatus?.toLowerCase() !== status.toLowerCase()) return;

            if (price) {
                const [min, max] = price.split("-").map(Number);
                const fee = typeof data.fee === "number" ? data.fee : parseFloat(data.fee);
                if (isNaN(fee) || fee < min || fee > max) return;
            }

            allServices.push({
                id: doc.id,
                ...data,
                serviceCategory: categoryName,
            });
            });
        }

    return allServices;
    }

    // Increment view count
    async incrementViewCount(categoryName, serviceId) {
        if (!categoryName || !serviceId) return;

        const docRef = doc(this.db, `csit314/AllServiceCategory/CleaningServiceData/${categoryName}/serviceListings/${serviceId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const current = docSnap.data().viewCount || 0;
            await updateDoc(docRef, { viewCount: current + 1 });
        }
    }

    // Increment shortlist count
    async incrementShortlistCount(categoryName, serviceId) {
        if (!categoryName || !serviceId) return;

        const docRef = doc(this.db, `csit314/AllServiceCategory/CleaningServiceData/${categoryName}/serviceListings/${serviceId}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const current = docSnap.data().viewShortlisted || 0;
            await updateDoc(docRef, { viewShortlisted: current + 1 });
        }
    }

 // Fetch all service listings
  async fetchAllServiceListings() {
    const basePath = "csit314/AllServiceCategory/CleaningServiceData";
    const categoriesCol = collection(this.db, basePath);
    const categoryDocs = await getDocs(categoriesCol);

    const allServices = [];

    for (const categoryDoc of categoryDocs.docs) {
      const categoryName = categoryDoc.id;
      const listingsPath = `${basePath}/${categoryName}/serviceListings`;
      const listingsCol = collection(this.db, listingsPath);
      const listingsSnap = await getDocs(listingsCol);

      listingsSnap.forEach(doc => {
        allServices.push({
          id: doc.id,
          ...doc.data(),
          serviceCategory: categoryName,
        });
      });
    }

    return allServices;
  }


  //create a booking
 async createBooking(serviceId, cleanerEmail, bookingDetails) {
  try {
    //reads current user's email from localstorage
    const userEmail = localStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      throw new Error("User email not found. User might not be logged in.");
    }

    //generate user id and transform into a firestore-compatible user id with "_"
    const userId = userEmail.replace(/[@.]/g, "_");

    //build firestore collection path
    const userBookingPath = collection(
      db,
      "csit314",
      "AllBookings",
      "Bookings",
      userId,
      "Bookings"
    );

    // Merge the details directly with the booking data
    //add a new booking document
    await addDoc(userBookingPath, {
      ...bookingDetails, // Spread the details directly
      serviceId,
      cleanerEmail,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

  // 🔵 Fetch bookings for logged-in user
  async getUserBookings() {
  try {
    //logging in with user-email
    const userEmail = localStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      throw new Error("User email not found. User might not be logged in.");
    }

    //generate user if
    const userId = userEmail.replace(/[@.]/g, "_");

    //build firestore collection reference path
    const userBookingsRef = collection(
      db,
      "csit314",
      "AllBookings",
      "Bookings",
      userId,
      "Bookings"
    );

    //fetching documents from firestore
    const snapshot = await getDocs(userBookingsRef);
    return snapshot.docs.map(doc => {
        //process fetched documents
      const data = doc.data();
      
      // Handle both old and new data structures
      if (data.details && data.details.details) {
        // Double-nested case - return the inner details
        return data.details.details;
      } else if (data.details) {
        // Single-nested case - return the details
        return data.details;
      } else {
        // New flat structure - return as is
        return data;
      }
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
}



// Add a service to favourites (shortlist)
 // Add to favourites
 async addToFavourites(serviceData) {
  try {
    // Get currently logged-in user's email from localStorage
    const userEmail = localStorage.getItem("loggedInUserEmail");
    if (!userEmail) {
      throw new Error("User email not found. User might not be logged in.");
    }

    // Replace dots and @ symbols to form a valid Firestore path segment
    const userId = userEmail.replace(/[@.]/g, "_");

    // Reference to the Firestore collection for this user's shortlisted services
    const favouritesRef = collection(
      db,
      "csit314",
      "AllBookings",
      "Shortlisted",
      userId,
      "Shortlisted"
    );

    // Add the full service object to the user's shortlisted collection
    await addDoc(favouritesRef, serviceData);

    console.log("Service added to favourites!");
  } catch (error) {
    console.error("Error adding to favourites:", error);
    throw error; // Re-throw for upstream handling if needed
  }
}

//removing a specific cleaning services from a user's fav
async removeFromFavourites(userEmail, serviceId) {
    //check to see if useremail and serviceid valid
  try {
    if (!userEmail || typeof userEmail !== "string") {
      throw new Error("User not authenticated or invalid userEmail");
    }
    if (!serviceId) {
      throw new Error("Invalid serviceId");
    }

    //build a reference to the user's shortlisted collection in firestore
    const favRef = collection(db, `csit314/AllBookings/Shortlisted/${userEmail}/Shortlisted`);
    const serviceQuery = query(favRef, where("serviceId", "==", serviceId));
    const querySnapshot = await getDocs(serviceQuery);

    if (querySnapshot.empty) {
      throw new Error("Service not found in favourites");
    }

    //if found, deletes all matching documents
    const deletionPromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletionPromises);
  } catch (error) {
    console.error("Error removing from favourites:", error);
    throw error;
  }
}

//check if a specific cleaning service is already a favourited by the user
async isServiceFavourited(userEmail, serviceId) {
    //validate email and service
  try {
    if (!userEmail || typeof userEmail !== "string") return false;
    if (!serviceId) return false;

    const favRef = collection(db, `csit314/AllBookings/Shortlisted/${userEmail}/Shortlisted`);

    //queries for documents where "serviceid" matches the target serviceID
    const checkQuery = query(favRef, where("serviceId", "==", serviceId));
    const snapshot = await getDocs(checkQuery);

    //returns true if any document is found
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking favourite status:", error);
    return false;
  }
}

//retrieves all favourited services for a specific user
async getFavourites(userEmail) {
    try {
       
      const userId = userEmail.split('@')[0]; // e.g., HM1 from HM1@gmail.com
      const shortlistRef = collection(db, `csit314/AllBookings/Shortlisted/${userId}/Shortlisted`);
      const snapshot = await getDocs(shortlistRef);

      //fetches all documents in that collection
      const services = [];
      snapshot.forEach(doc => {
        services.push(doc.data());
      });

      //returns the document
      return services;
    } catch (error) {
      console.error("Error fetching favourites:", error);
      return [];
    }
  }
}


    export {db, Firebase}
      
      

