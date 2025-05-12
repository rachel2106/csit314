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