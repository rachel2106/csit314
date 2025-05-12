
import { generateReportEntity } from './generateReportEntity.js';

export class pmDailyReportController {
    async getDailyReport (){
        const reportEntity = new generateReportEntity();
        const reportList = await reportEntity.getDailyReport();

        return reportList
    }
}