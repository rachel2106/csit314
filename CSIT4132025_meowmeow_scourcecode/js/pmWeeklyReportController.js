 import { generateReportEntity } from './generateReportEntity.js';
 
 export class pmWeeklyReportController {
     async getWeeklyReport (){
         const reportEntity = new generateReportEntity();
         const report = await reportEntity.getWeeklyReport();
 
         return report;
     }
 }