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
    serverTimestamp,
    collectionGroup
 } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'



// Firebase core
// import { initializeApp } from 'firebase/app';

// // Firebase Auth
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   updateProfile,
// } from 'firebase/auth';

// // Firebase Firestore
// import {
//   getFirestore,
//   collection,
//   doc,
//   setDoc,
//   addDoc,
//   getDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   serverTimestamp,
//   collectionGroup,
// } from 'firebase/firestore';


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
    
            // if (!validTypes.includes(userTypeFormatted)) {
            //     return {
            //         status: "error",
            //         message: `Invalid userType provided: ${newUser.userType}`
            //     };
            // }
    
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

            const fixProfile = [ "cleaners", "homeowners", "useradmin", "platformmanager" ]
            const cleanedProfile = userType.trim().toLowerCase();
            console.log(cleanedProfile);


            // Validate profile
            if (!userType || typeof userType !== "string" || userType.trim() === "") {
                return {
                    status: "error", //string
                    message: "Invalid or missing profile" //string
                };
            }

            // ALTERNATE FLOW
            if (fixProfile.includes(cleanedProfile)) {
                return {
                    status: "error",
                    message: `Profile Existed`
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

            // // Validate name
            // if (!serviceCategory || typeof serviceCategory !== "string" || serviceCategory.trim() === "") {
            //     return {
            //         status: "error",
            //         message: "Invalid or missing category name"
            //     };
            // }

            // // Validate name
            // if (!description || typeof description !== "string" || description.trim() === "") {
            //     return {
            //         status: "error",
            //         message: "Invalid or missing description name"
            //     };
            // }

            const categoryRef = collection(this.db, "csit314/AllServiceCategory/CleaningServiceData");

            // ALTERNATE FLOW
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

        // // ALTERNATE FLOW
        // if (!categoryId || !serviceCategory || !description) {
        //     // console.error("Error: Missing required fields for user update.");
        //     return {success: false, message: "Missing required fields!"};
        // }

        try{
            // console.log("Updating service data in Firestore:", updatedCategoryData);

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
    // View Counts
    async viewCounts(cleanerEmail) {
        try {
            const categoriesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
            const categorySnapshots = await getDocs(categoriesRef);
    
            const cleanerViewCounts = [];
    
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
                      cleanerViewCounts.push({
                        listingId: listingDoc.id,
                        viewCount: data.viewCount || 0
                      });
                    }
                  });
            }
    
            return cleanerViewCounts; //array
    
        } catch (error) {
            console.error("Error fetching listings by cleaner email:", error);
            return [];
        }
    }

    //Shortlisted Counts
    async shortlistedCounts(cleanerEmail) {
        try {
            const categoriesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
            const categorySnapshots = await getDocs(categoriesRef);
    
            const cleanerShortlistedCounts = [];
    
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
                        cleanerShortlistedCounts.push({
                        listingId: listingDoc.id,
                        viewShortlisted: data.viewShortlisted || 0
                      });
                    }
                  });
            }
    
            return cleanerShortlistedCounts; //array
    
        } catch (error) {
            console.error("Error fetching listings by cleaner email:", error);
            return [];
        }
    }
    // Create a new service listing (used by Cleaner)
    async createServiceListing(listingData) {
        try {
            const { serviceListing, serviceCategory, frequency, fee, details,listStatus, currentUserEmail  } = listingData;
            console.log("This is frequency " + frequency)


            //ALTERNATE FLOW
            // Validate name
            if (!serviceListing || !serviceCategory || !frequency || !fee || !details || !listStatus || !currentUserEmail) {
                console.error("Missing required fields:", listingData);
                return {
                    status: "error",
                    message: "Missing required fields!!" 
                 };
            }

            const categoryDocRef = doc(this.db, "csit314/AllServiceCategory/CleaningServiceData", serviceCategory);

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

            //Check if category already exists (NOT alternate flow, just backend check handler)
            const catSnap = await getDoc(categoryDocRef);
            if (!catSnap.exists()) {
                console.error(`Category "${serviceCategory}" does not exist.`);
                return {
                    status: "error",
                    message: "Category does not exist"
                };
            }

            let updateData = { numOfServices: (catSnap.data().numOfServices || 0) + 1 };

            if (!cleanerSnap.exists()) {
                // First time this cleaner is adding to this category
                updateData.numCleaner = (catSnap.data().numCleaner || 0) + 1;

                // Create a marker document to track this cleaner
                await setDoc(cleanerTrackerRef, { email: currentUserEmail, timestamp: Date.now() });
            }

            // Update the category document
            await updateDoc(categoryDocRef, updateData);

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

        //ALTERNATE FLOW
        if (!listingId || !serviceCategory || !listingName || !listingFrequency || !fee || !listStatus || !details) {
            // console.error("Error: Missing required fields for user update."); 
            return {success: false, message: "Missing required fields!"};

        }

        try{
            // console.log("Updating service data in Firestore:", updatedListingData);

            // Reference to the Firestore document for the user
            const listingRef = doc(this.db, `csit314/AllServiceCategory/CleaningServiceData/${serviceCategory}/serviceListings`, listingId);
            const listingSnap = await getDoc(listingRef);

            // if (!listingSnap.exists()) {
            //     return { success: false, message: "Listing not found." };
            // }

            const listingData = listingSnap.data();
            // if (listingData.createdBy !== createdBy) {
            //     return { success: false, message: "Unauthorized: You can only update your own listings." };
            // }
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

            const categoriesRef = collection(db, `csit314/AllServiceCategory/CleaningServiceData`);
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

    //Display booking history
    async getHistoryList(cleanerEmail) {
        try {
            const results = [];

            const querySnapshot = await getDocs(collectionGroup(db, "Bookings"));


            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.cleaner === cleanerEmail){
                    results.push({
                        id: doc.id,
                        ...data
                      });
                }
                
              });

            return results; 
      
      
        } catch (error) {
          console.error("Error fetching bookings by cleaner email:", error);
          throw error;
        }
      }

      //Display booking history
    async searchBookingHistory(searchData) {
        try {
            const {categoryName, listingName, homeownerName, createdBy } = searchData;
            
            const results = [];
            const querySnapshot = await getDocs(collectionGroup(db, "Bookings"));



            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.cleaner === createdBy){
                    if(categoryName){
                        
                        const cleanedInputCat = categoryName.trim().toLowerCase();
                        const dataCat =  data.categoryName;
                        const cleanedDataCat = dataCat.trim().toLowerCase();

                        if(cleanedDataCat === cleanedInputCat){
                            results.push({
                                id: doc.id,
                                ...data
                              });
                        }
                    }
                    if(listingName){
                        if (data.listingName === listingName){
                            results.push({
                                id: doc.id,
                                ...data
                              });
                        }
                    }
                    if(homeownerName){
                        if (data.serviceId === homeownerName){
                            results.push({
                                id: doc.id,
                                ...data
                              });
                        }

                    } 
                }
                
              });

            console.log(results);
            return results; 
      
      
        } catch (error) {
          console.error("Error fetching bookings by cleaner email:", error);
          throw error;
        }
      }
      


     // Increment view count
     async addCountView(countData) {
        const { category, listingName, cleaner } = countData;
    
        if (!category || !listingName || !cleaner) return;
    
        const listingId = listingName.toLowerCase().replace(/\s+/g, "_");
    
        const listingRef = doc(
            this.db,
            `csit314/AllServiceCategory/CleaningServiceData/${category}/serviceListings`,
            listingId
        );
    
        try {
            const listingSnap = await getDoc(listingRef);
    
            if (!listingSnap.exists()) {
                console.log("Listing does not exist.");
                return;
            }
    
            const listingData = listingSnap.data();
    
            if (listingData.createdBy !== cleaner) {
                console.log("Cleaner mismatch.");
                return;
            }
    
            const currentCount = listingData.viewCount || 0;
    
            await updateDoc(listingRef, {
                viewCount: currentCount + 1,
            });

            return; //nothing is returned
    
        } catch (error) {
            console.error("Error incrementing view count:", error);
        }
    }




//Homeowner
// Increment numOfShortlisted count
async incrementNumOfShortlisted(shortlistData) {
    const { category, listingName, cleaner } = shortlistData;

    if (!category || !listingName || !cleaner) return;

    // Use the same normalized listingId format
    const listingId = listingName.toLowerCase().replace(/\s+/g, "_");

    // Reference path same as your addCountView but for service listing document
    const listingRef = doc(
        this.db,
        `csit314/AllServiceCategory/CleaningServiceData/${category}/serviceListings`,
        listingId
    );

    try {
        const listingSnap = await getDoc(listingRef);

        if (!listingSnap.exists()) {
            console.log("Listing does not exist.");
            return;
        }

        const listingData = listingSnap.data();

        if (listingData.createdBy !== cleaner) {
            console.log("Cleaner mismatch.");
            return;
        }

        const currentCount = listingData.viewShortlisted || 0;

        await updateDoc(listingRef, {
            viewShortlisted: currentCount + 1,
        });

        return; // nothing specific to return

    } catch (error) {
        console.error("Error incrementing numOfShortlisted:", error);
    }
}







// Fetch all service listings from all categories
    async fetchAllCleaningServices() {
    //root path where categories of cleaning services are stored in firestore
    const basePath = "csit314/AllServiceCategory/CleaningServiceData";
    const categoriesCol = collection(this.db, basePath);
    //fetches are all doc in this categories collection || await is used cause is asynchronous
    const categoryDocs = await getDocs(categoriesCol);

    const allServices = [];

    //code is in a loop 
    for (const categoryDoc of categoryDocs.docs) {
        const categoryName = categoryDoc.id;
        //listingPath is constructed by appending "serviceListings" to the path of the category document
        //points to a subcollection under each category that hols the actual service listings
        const listingsPath = `${basePath}/${categoryName}/serviceListings`;
        //reference to the subcollection
        const listingsCol = collection(this.db, listingsPath);
        //fetches all documents from this subcollection 
        const listingsSnap = await getDocs(listingsCol);

        //fetches all documents from this subcollection (all individual service in the listing)
        listingsSnap.forEach(doc => {
        allServices.push({ //pushes an object into here
            id: doc.id,
            ...doc.data(),
            serviceCategory: categoryName, //new property is set to the current category name to keep track of which category the service belongs to
        });
        });
    }
            
    return allServices; //loops thru all categories and listings and then the function returns it
        //array
    }

   
    

    // Fetch filtered cleaning services (Search)
    async fetchCleaningServices(filters) {
        const { category, price, status } = filters; //takes an object filters 
        //reads all service categeory doc from firestore
        const basePath = "csit314/AllServiceCategory/CleaningServiceData"; 
        const categoriesCol = collection(this.db, basePath);
        const categoryDocs = await getDocs(categoriesCol);

        //to collect all matching service listings across categories
        const allServices = [];

        //loop through each category document fetched
        //each category doc ID is stored as categoryName
        for (const categoryDoc of categoryDocs.docs) {
            const categoryName = categoryDoc.id;

            //if the user specified a category filter:
                //skips the loop iteration unless the category matches
                //only the matching category's listings will be fetched
            if (category && category !== categoryName) continue;


            //build the path to the subcollection serviceListings under the current category
            //fetch all service listings docs inside this subcollection async
            const listingsPath = `${basePath}/${categoryName}/serviceListings`;
            const listingsCol = collection(this.db, listingsPath);
            const listingsSnap = await getDocs(listingsCol);


            //for each service listing, retrieves its data as an object
            listingsSnap.forEach(doc => {
            const data = doc.data();


            //filter provided:
                //check if service lisitngs matches the filter status
                //if doesnt match, skips the listing
            if (status && data.listStatus?.toLowerCase() !== status.toLowerCase()) return;


            //if price filter is provieded
                //spilt the string into mini and max price
                //convert the string no. to actual no.
                //convert the listing fee field to a no. if stored in a string
                //skip listing when fee is not a valid no. or when fee is outside the price range
            if (price) {
                const [min, max] = price.split("-").map(Number);
                const fee = typeof data.fee === "number" ? data.fee : parseFloat(data.fee);
                if (isNaN(fee) || fee < min || fee > max) return;
            }


            //listings that pass all filters, add an object that contains
                //firestore doc ID
                //all fields in the service listings
                //service category it belongs to
            allServices.push({
                id: doc.id,
                ...data,
                serviceCategory: categoryName,
            });
            });
        }

        return allServices; //processing all categories and listings of matching service listings
            //array
    }





    
   // Create a new booking
   async createBooking(serviceId, cleanerEmail, userEmail, details) {
        try {
        //ensures that the booking is tied to a valid userEmail
        //throws an error if the email is missing or not a string
            if (!userEmail || typeof userEmail !== 'string') {
                throw new Error("User email not found or invalid. User might not be logged in or email is not a string.");
            }
        
            // Sanitize email by replacing '@' and '.' with '_'
            const safeEmail = userEmail.replace(/[@.]/g, "_");
        
            //defines the path, with own subcollection 
            const userBookingPath = collection(
                db,
                "csit314",
                "AllBookings",
                "Bookings",
                safeEmail,
                "Bookings"
            );
        
            //combines all booking data
            const bookingData = {
                ...details,  // Spread details directly into the main object
                serviceId,
                createdAt: serverTimestamp(),
            };
        
            //adds a new doc to the homeowner's booking subcollection, firestore auto-gen the doc ID
            await addDoc(userBookingPath, bookingData);
            return true;
    
        //if an error occurs, log it and retun false
        } catch (error) {
            console.error("Error creating booking:", error);
            return false;
        }
    }

//  Fetch bookings for logged-in user (View booking)
async getUserBookings(userEmail) {
  try {
    //checks if the userEmail is provided
    if (!userEmail) {
      throw new Error("User email not found. User might not be logged in.");
    }

    //names cannot contain @ or . so it uses underscore
    const userId = userEmail.replace(/[@.]/g, "_");

    //constructs a reference to the user's personal bookings subcollection
    const userBookingsRef = collection(
      db,
      "csit314",
      "AllBookings",
      "Bookings",
      userId,
      "Bookings"
    );

    //async retrieves all docs under the user's bookings subcollection
    const snapshot = await getDocs(userBookingsRef);
    return snapshot.docs.map(doc => ({ //what each element includes
      id: doc.id,
      ...doc.data()
    }));

    //catches any errors
    //logs them and rethrows the error to let the caller handle
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw error;
  }
}

// Search bookings by category (with empty category = no filter)

async  searchBookings(userEmail, category) {
  try {
    //ensures the user is logged in and their email exists
    if (!userEmail) throw new Error("User email not found.");

    const userId = userEmail.replace(/[@.]/g, "_");

    //points to the firestore path
    const userBookingsRef = collection(
      db,
      "csit314",
      "AllBookings",
      "Bookings",
      userId,
      "Bookings"
    );

    let q;
    //if category is provided, it applies a filter,
    //if its empty or not provided, it fetches all bookings for the user without filtering
    if (category && category.trim() !== "") {
      q = query(userBookingsRef, where("categoryName", "==", category));
    } else {
      q = query(userBookingsRef);
    }

    //converts each doc to a plain object
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));


    // catches and logs any error during the fetch or query
  } catch (error) {
    console.error("Error filtering bookings by category:", error);
    throw error;
  }
}




// Add a service to favourites (shortlist)
 // Add to favourites
async addToFavourites(serviceData) {
  try {

    //retrieves the logged-in user's email from local storage
    const userEmail = localStorage.getItem("loggedInUserEmail");

    //prevents unauthenticated users from using this function
    //ensures the feature is restricted to homeowners
    if (!userEmail) {
      throw new Error("Only homeowners can add to favourites. Please ensure a homeowner is logged in.");
    }

    //ensures serviceData is an object
    //contains expected info like service name, category
    if (typeof serviceData !== "object" || serviceData === null || Array.isArray(serviceData)) {
      throw new Error("Invalid serviceData. Expected a non-null object.");
    }

    
    const userId = userEmail.replace(/[@.]/g, "_");
    const favouritesRef = collection(db, "csit314", "AllBookings", "Shortlisted", userId, "Shortlisted");

    //creates a new doc with serviceData in the user's shortlisted subcollection
    await addDoc(favouritesRef, serviceData);
    console.log("Service added to favourites!");
  } catch (error) {
    console.error("Error adding to favourites:", error.message);
    throw error;
  }
}


// Check if service is favourited
async isServiceFavourited(userEmail, serviceId) {
  try {
    if (!userEmail || typeof userEmail !== "string") return false;
    if (!serviceId) return false;

    const userId = userEmail.replace(/[@.]/g, "_");
    const favRef = collection(db, `csit314/AllBookings/Shortlisted/${userId}/Shortlisted`);
    const checkQuery = query(favRef, where("serviceId", "==", serviceId));
    const snapshot = await getDocs(checkQuery);

    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking favourite status:", error);
    return false;
  }
}

// Get all favourites
async getFavourites(userEmail) {
  try {
    const userId = userEmail.replace(/[@.]/g, "_");
    const shortlistRef = collection(db, `csit314/AllBookings/Shortlisted/${userId}/Shortlisted`);
    const snapshot = await getDocs(shortlistRef);

    const services = [];
    snapshot.forEach(doc => {
      services.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log("Fetched favourites:", services);
    return services;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return [];
  }
}

//creates a booking for shortlisted service
 async createBookingShortlist(serviceId, cleanerEmail, userEmail, details) {
    try {
        if (!userEmail) throw new Error("User email is required for booking.");
        if (!serviceId) throw new Error("Service ID is required for booking.");

        const userId = userEmail.replace(/[@.]/g, "_");

        //creates a new doc with the booking data in the user's bookings collection
        const bookingsRef = collection(
            db,
            "csit314",
            "AllBookings",
            "Bookings",
            userId,
            "Bookings"
        );

        // Transform the booking data to match your desired structure
        const bookingData = {
            cleanerEmail,
                ...details,  // Spread details directly into the main object
            serviceId,
            createdAt: serverTimestamp(),
        };

        await addDoc(bookingsRef, bookingData);

        console.log("Booking created successfully!");
        return true;
    } catch (error) {
        console.error("Booking creation failed:", error);
        throw error;
    }
}

async searchFavourite(userEmail, category) {
    try {
      //ensures the user is logged in and their email exists
      if (!userEmail) throw new Error("User email not found.");
      console.log(userEmail+ " this is category " + category)
  
      const userId = userEmail.replace(/[@.]/g, "_");
      console.log(userId);
  
      //points to the firestore path
      const userFavouriteRef = collection(
        db,
        "csit314",
        "AllBookings",
        "Shortlisted",
        userId,
        "Shortlisted"
      );
  
      let q;
      //if category is provided, it applies a filter,
      //if its empty or not provided, it fetches all bookings for the user without filtering
      if (category && category.trim() !== "") {
        q = query(userFavouriteRef, where("serviceCategory", "==", category));
      }
    //   if (category && category.trim() !== "") {
    //     q = query(userFavouriteRef, where("serviceCategory", "==", category));
    //   } else {
    //     q = query(userFavouriteRef);
    //   }
  
      //converts each doc to a plain object
        const snapshot = await getDocs(q);
        const favouriteList = [];

        snapshot.forEach(doc => {
        favouriteList.push({
            id: doc.id,
            ...doc.data()
        });
        });
  
        return favouriteList;
      // catches and logs any error during the fetch or query
    } catch (error) {
      console.error("Error filtering bookings by category:", error);
      throw error;
    }
  }




}


    export {db, Firebase}
      
      

