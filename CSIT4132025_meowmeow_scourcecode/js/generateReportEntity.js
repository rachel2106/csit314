import { db } from "./firebaseAuth.js";
import Firebase from "./firebaseAuth.js";

const firebase = new Firebase(); // Using the same Firebase instance

export class generateReportEntity {
    constructor() {
        this.db = db;
    }

    //Generate Daily Report
    async getDailyReport(){
        try{
            const report = await firebase.getDailyReport()
            return report
        } catch (error){
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }
    }

    //Generate weekly Report
    async getWeeklyReport(){
        try{
            const report = await firebase.getWeeklyReport()
            return report
        } catch (error){
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }
    }

    //Generate Daily Report
    async getMonthlyReport(theMonth){
        try{
            const report = await firebase.getMonthlyReport(theMonth)
            return report
        } catch (error){
            console.error("Error creating service category:", error);
            return { status: "error", message: error.message };
        }
    }

}

export default generateReportEntity;