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
    
            // Lead users back to login page
            window.location.href = "loginPage.html";
    
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    }


    //Login for users
    async loginUser(email, password, userType) {
        try {
            const usersCollection = collection(db, "csit314/AllUsers/UserData");
            const q = query(usersCollection, where("email", "==", email), where("userType", "==", userType));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                return { status: "error", message: "No user found with this email and profile." };
            }
    
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
    
            console.log("Fetched User Data:", userData); // Debugging output for user data
    
            // Simple password check (plain-text example, consider hashing passwords in production)
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
        
                    return {
                        status: "success",
                        message: "User created successfully with duplicate email allowed.",
                        userEmail: newUser.userEmail
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
        
                    return {
                        status: "success",
                        message: "User created successfully",
                        userEmail: newUser.userEmail
                    };
                }
            } catch (error) {
                console.error("Error creating user in Firestore:", error);
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


        
        // Create new profile in Firestore
        async createNewProfile(newUser) {
            try {
            // Define valid user types
            const validTypes = ["userAdmin", "platformManager", "cleaners", "homeowners"];
            const userTypeFormatted = newUser.userType.trim().toLowerCase(); // Ensure lowercase type

            // Check if the userType is valid
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

            // If user already exists, return an error
            if (!querySnapshot.empty) {
                return {
                    status: "error",
                    message: "A user with this email already exists."
                };
            }

            // If email doesn't exist, create the user profile in Firestore
            const userDocRef = doc(userCollectionRef, newUser.userEmail);
            await setDoc(userDocRef, {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.userEmail,
                password: newUser.userPass, // Consider hashing passwords in production
                userType: userTypeFormatted,
                userStatus: "Active"
            });

            return {
                status: "success",
                message: "Profile created successfully",
                userEmail: newUser.userEmail
            };
            } catch (error) {
                console.error("Error creating new profile in Firestore:", error);
                return {
                    status: "error",
                    message: error.message
                };
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
        
                // Refresh the page after the update
                window.location.reload();
        
                return { success: true, message: "User updated successfully in Firestore." };
            } catch (error) {
                console.error("Error updating Firestore user:", error);
                return { success: false, message: `Error updating Firestore user: ${error.message}` };
            }
        }
        




    // Platform Manager Functions
    // Generate Report Daily, Weekly, Monthly
    async getDailyReport (dailyDate){
        try{
            const { start, end } = dailyDate;
            const categoriesSnap = await getDocs(collection(this.db, "csit314/AllServiceCategory/CleaningServiceData"));
            let groupedServices = [];

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
            return {
                status: "success",
                date: start.toDateString(),
                report : groupedServices
            };
        } catch (error){
            console.error("Error generating daily report:", error);
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
            const status = "success";

            return status;
                // message: "Service category created successfully",
                // categoryId: categoryDocRef.i;
        } catch (error) {
            console.error("Error creating service category:", error);
            return {
                status: "error",
                message: error.message
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


            return categoryList;
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
            window.location.reload(); 

            return { success: true, message: "Service category updated"};
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
    
            return { success: true };
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


            return categoryList;
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
            console.log("This is frequency" + frequency)


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

            // create the listing into the database
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
                await setDoc(cleanerTrackerRef, { 
                    email: currentUserEmail,
                    normalizedEmail: currentUserEmail.toLowerCase().trim(), 
                    timestamp: serverTimestamp() });
            }

            // Update the category document
            await updateDoc(categoryDocRef, updateData);

            let status = "success";
            return status;

        } catch (error) {
            console.error("Error creating service category:", error);
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
    
            return cleanerListings;
    
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

            return { success: true, message: "Service category updated"};
        } catch (error) {
            console.error("Error updating service category:", error);
            return { success: false, message: `Error updating category:${error.message}` };
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
            console.error("Error deleting Firestore service category:", error);
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


            return listingList;
        }catch (error){
            console.error("Error deleting Firestore user:", error);
            throw error;
        }
    }


        // Homeowner codes
        // Fetch all cleaning services
    async fetchAllCleaningServices() {
        const servicesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");
        const querySnapshot = await getDocs(servicesRef);
        const services = [];

        querySnapshot.forEach((doc) => {
            services.push(doc.data());
        });

        return services;
    }

    // Fetch filtered cleaning services based on user selection (already existing)
    async fetchCleaningServices(filters) {
        const servicesRef = collection(db, "csit314/AllServiceCategory/CleaningServiceData");

        let q = servicesRef;

        // Filter by category
        if (filters.category) {
            q = query(q, where("category", "==", filters.category));
        }

        // Filter by status
        if (filters.status) {
            q = query(q, where("status", "==", filters.status));
        }

        // Filter by price range (using the correct syntax for multiple conditions)
        if (filters.price) {
            const priceRange = filters.price.split("-");
            const minPrice = parseInt(priceRange[0]);
            const maxPrice = parseInt(priceRange[1]);
            
            // Firestore queries for price ranges should use `>=` and `<=` in the same query
            q = query(q, where("price", ">=", minPrice), where("price", "<=", maxPrice));
        }

        // Execute the query
        const querySnapshot = await getDocs(q);
        const services = [];

        querySnapshot.forEach((doc) => {
            services.push(doc.data());
        });

        return services;
    }


        
    }
    export {db, Firebase}
      

