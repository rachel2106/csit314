 // Platform Manager Functions
<<<<<<< HEAD
    // Generate Report Daily, Weekly, Monthly
    async getDailyReport (dailyData){
        try{
            const { start, end } = dailyData;
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
                timeframe: start.toDateString(),
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
            return {
                status: "success",
                timeframe: `${start.toDateString()} to ${end.toDateString()}`,
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
            return {
                status: "success",
                timeframe: monthlyData,
                report : groupedServices
            };
        } catch (error){
            console.error("Error generating monthly report:", error);
            return {
                status: "error",
                message: error.message
            };
        }
    }


=======



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

            // const categoryDocRef = 
            await setDoc(listingDocRef , {
                listingName: serviceListing.trim(),
                normalizedListing: normalizedNaming,
                fee: parseFloat(fee),
                details: details.trim(),
                createdBy: currentUserEmail,
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
    
    



// THIS IS CSS
/* PLATFORM MANAGER generate report page */

.platformManager-report{
    text-align: center;
    font-size: 30px;
    margin-top: 0;
}

#the-header{
    text-align: center;
    font-size: 24px;
}
#generateReportBtn{
    width: 15%;
    height: 50px;
    /* margin-left: 20%; */
    background-color: #81cbd4;
    margin-top: 24px;
    cursor: pointer;
    /* font-weight: bold; */
    font-size: 20px;
    text-decoration: none;
    text-align: center;
    color: black;
    border: 1px solid black;

}

#report-timeframe{
    font-size: 18px;
}

#title-timeFrame{
    font-size: 30px;
    font-weight: bold;
}

