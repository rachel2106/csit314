 import { generateReportEntity } from './generateReportEntity.js';
 
 export class pmWeeklyReportController {
     async getWeeklyReport (){
         const reportEntity = new generateReportEntity();
         const reportList = await reportEntity.getWeeklyReport();
 
         return reportList
     }
 }